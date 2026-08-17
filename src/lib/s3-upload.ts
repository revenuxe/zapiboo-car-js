import { getUploadUrl } from "@/lib/s3.functions";

/**
 * Prepare an image for upload. Raster images are resized + recompressed on a
 * canvas; transparency-capable formats stay PNG so they never go black, JPEGs
 * stay JPEG. SVGs are uploaded verbatim (vector, tiny).
 */
async function prepareImage(
  file: File,
  maxDim: number,
  quality: number,
): Promise<{ blob: Blob; contentType: string; ext: string }> {
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  const isSvg = type === "image/svg+xml" || name.endsWith(".svg");
  const isJpeg = type === "image/jpeg" || type === "image/jpg";

  if (isSvg) {
    return { blob: file, contentType: "image/svg+xml", ext: "svg" };
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onerror = () => reject(new Error("Could not load the image."));
    i.onload = () => resolve(i);
    i.src = dataUrl;
  });

  let iw = img.naturalWidth || img.width;
  let ih = img.naturalHeight || img.height;
  if (!iw || !ih) {
    iw = maxDim;
    ih = maxDim;
  }
  const scale = Math.min(1, maxDim / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * scale));
  const h = Math.max(1, Math.round(ih * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported.");
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  const outType = isJpeg ? "image/jpeg" : "image/png";
  const ext = isJpeg ? "jpg" : "png";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not encode the image."))),
      outType,
      quality,
    );
  });

  return { blob, contentType: outType, ext };
}

function parseImageDataUrl(input: string): { contentType: string; ext: string } {
  const trimmed = input.trim();
  const match = /^data:([^;,]+)(?:;[^,]*)?;base64,(.*)$/is.exec(trimmed);
  if (!match) throw new Error("Invalid image data.");

  const contentType = (match[1] || "image/jpeg").toLowerCase();
  const base64 = match[2].replace(/\s/g, "");
  if (!base64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
    throw new Error("Invalid image data.");
  }

  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : contentType.includes("gif")
        ? "gif"
        : contentType.includes("svg")
          ? "svg"
          : "jpg";

  return { contentType, ext };
}

async function uploadBlobToS3(blob: Blob, folder: string, ext: string, contentType: string): Promise<string> {
  const { uploadUrl, publicUrl } = await getUploadUrl({ data: { folder, ext, contentType } });
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });
  if (!response.ok) {
    throw new Error(`S3 upload failed (${response.status}).`);
  }
  return publicUrl;
}

/**
 * Compress + upload directly to Amazon S3 with a short-lived URL issued by
 * the application server. Image bytes never pass through Supabase.
 */
export async function uploadImageToS3(
  file: File,
  folder: string,
  opts: { maxDim?: number; quality?: number } = {},
): Promise<string> {
  const { maxDim = 1280, quality = 0.82 } = opts;
  const { blob, contentType, ext } = await prepareImage(file, maxDim, quality);
  return uploadBlobToS3(blob, folder, ext, contentType);
}

/**
 * Upload an already-prepared JPEG/PNG data URL (e.g. a canvas-compressed photo)
 * directly to Amazon S3 and return its public URL. Used by customer flows
 * like the pickup booking photo, where the image is compressed before upload.
 */
export async function uploadDataUrlToS3(dataUrl: string, folder: string): Promise<string> {
  const { contentType, ext } = parseImageDataUrl(dataUrl);
  const blob = await (await fetch(dataUrl)).blob();
  return uploadBlobToS3(blob, folder, ext, contentType);
}
