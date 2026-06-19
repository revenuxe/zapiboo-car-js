import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns a presigned S3 PUT URL so the browser can upload an image directly to
 * Amazon S3 (no image bytes ever touch Supabase). Admin-only.
 */
export const getUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { folder?: string; ext?: string }) => ({
    folder: typeof input?.folder === "string" ? input.folder : "uploads",
    ext: typeof input?.ext === "string" ? input.ext : "bin",
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

    const { buildObjectKey, presignPutUrl, publicUrlForKey } = await import("./s3.server");
    const key = buildObjectKey(data.folder, data.ext);
    const uploadUrl = presignPutUrl(key, 900);
    const publicUrl = publicUrlForKey(key);
    return { uploadUrl, publicUrl, key };
  });
