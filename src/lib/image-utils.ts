import { compressImageToWebp } from './client-image';

/**
 * Backwards-compatible upload helper. All raster uploads are resized and
 * re-encoded as WebP, including files that were already WebP.
 */
export function compressImage(file: File, maxDim = 1280, quality = 0.72): Promise<string> {
  return compressImageToWebp(file, maxDim, quality);
}
