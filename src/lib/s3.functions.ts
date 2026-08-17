import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns a presigned S3 PUT URL so the browser can upload an image directly to
 * Amazon S3 (no image bytes touch Supabase). On Amplify, signing uses the
 * short-lived credentials from the SSR Compute role. Admin-only.
 */
const allowedFolders = new Set(["brands", "series", "models", "listings"]);
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

export const getUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { folder?: string; ext?: string; contentType?: string }) => ({
    folder: typeof input?.folder === "string" ? input.folder : "uploads",
    ext: typeof input?.ext === "string" ? input.ext : "bin",
    contentType: typeof input?.contentType === "string" ? input.contentType.toLowerCase() : "",
  }))
  .handler(async ({ data, context }) => {
    // Only admins may upload catalog imagery.
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin) {
      throw new Error("Forbidden: admin access required.");
    }

    if (!allowedFolders.has(data.folder) || !allowedImageTypes.has(data.contentType)) {
      throw new Error("Unsupported image upload request.");
    }

    const { buildObjectKey, presignPutUrl, publicUrlForKey } = await import("./s3.server");
    const key = buildObjectKey(data.folder, data.ext);
    const uploadUrl = await presignPutUrl(key, data.contentType);
    const publicUrl = publicUrlForKey(key);
    return { uploadUrl, publicUrl, key };
  });
