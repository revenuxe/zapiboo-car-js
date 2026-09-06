/**
 * Keeps the original asset URL in the database while asking Cloudinary to
 * deliver only the pixels and format needed by a card in the interface.
 */
export function optimizedImageUrl(source: string | null | undefined, width = 640) {
  if (!source || !source.includes("res.cloudinary.com") || !source.includes("/upload/")) return source ?? "";
  if (/\/upload\/[^/]*(?:f_auto|q_auto|w_\d)/.test(source)) return source;

  return source.replace("/upload/", `/upload/f_auto,q_auto:eco,c_limit,w_${width}/`);
}
