import { supabase } from "@/integrations/supabase/client";

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

async function blobToBase64(blob: Blob): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the prepared image."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
  return dataUrl.slice(dataUrl.indexOf(",") + 1);
}

async function getEdgeFunctionErrorMessage(error: unknown): Promise<string> {
  const fallback = error instanceof Error ? error.message : "Upload failed.";
  const response = (error as { context?: Response | null })?.context;
  if (!response) return fallback;

  try {
    const payload = await response.clone().json();
    if (payload && typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    try {
      const text = await response.clone().text();
      if (text) return text.slice(0, 500);
    } catch {
      // Keep the original Supabase error when the response body is unavailable.
    }
  }

  return fallback;
}

/**
 * Compress + upload an image to Amazon S3 through a Supabase Edge Function and
 * return its public URL. Used by every admin image field (brands, series,
 * models, listings).
 */
export async function uploadImageToS3(
  file: File,
  folder: string,
  opts: { maxDim?: number; quality?: number } = {},
): Promise<string> {
  const { maxDim = 1280, quality = 0.82 } = opts;
  const { blob, contentType, ext } = await prepareImage(file, maxDim, quality);

  const { data, error } = await supabase.functions.invoke<{ publicUrl: string; key: string }>("s3-upload", {
    body: {
      folder,
      ext,
      contentType,
      base64: await blobToBase64(blob),
    },
  });
  if (error) {
    throw new Error(await getEdgeFunctionErrorMessage(error));
  }
  if (!data?.publicUrl) {
    throw new Error("Upload failed: Supabase did not return an S3 URL.");
  }
  return data.publicUrl;
}

/**
 * Upload an already-prepared JPEG/PNG data URL (e.g. a canvas-compressed photo)
 * to Amazon S3 and return its public URL. Used by customer flows like the
 * pickup booking photo, where the image is compressed before upload.
 */
export async function uploadDataUrlToS3(dataUrl: string, folder: string): Promise<string> {
  const match = /^data:([^;]+);base64,(.*)$/i.exec(dataUrl);
  if (!match) throw new Error("Invalid image data.");
  const contentType = match[1] || "image/jpeg";
  const base64 = match[2];
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";

  const { data, error } = await supabase.functions.invoke<{ publicUrl: string; key: string }>("s3-upload", {
    body: { folder, ext, contentType, base64 },
  });
  if (error) {
    throw new Error(await getEdgeFunctionErrorMessage(error));
  }
  if (!data?.publicUrl) {
    throw new Error("Upload failed: Supabase did not return an S3 URL.");
  }
  return data.publicUrl;
}
