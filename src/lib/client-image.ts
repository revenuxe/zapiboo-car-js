/** Creates a smaller WebP data URL for browser-based image uploads. */
export async function compressImageToWebp(file: File, maxImageEdge = 1600, quality = 0.78): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Choose a valid image file.');

  const source = URL.createObjectURL(file);
  try {
    const image = await loadImage(source);
    const scale = Math.min(1, maxImageEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not prepare this image.');
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/webp', quality);
  } finally {
    URL.revokeObjectURL(source);
  }
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('This image could not be read.'));
    image.src = source;
  });
}
