import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Server-only S3 helpers. The AWS SDK uses its default credential provider
 * chain, so Amplify supplies short-lived credentials from the SSR Compute role.
 * No long-lived AWS access key is read from the application environment.
 */

type S3Config = {
  region: string;
  bucket: string;
};

export function getS3Config(): S3Config {
  const region = process.env.S3_REGION || process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const bucket = process.env.S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME || process.env.AWS_BUCKET;
  const missing = [
    ...(!region ? ["S3_REGION"] : []),
    ...(!bucket ? ["S3_BUCKET_NAME"] : []),
  ];
  if (missing.length) {
    throw new Error(`Missing AWS S3 env var(s): ${missing.join(", ")}`);
  }
  return {
    region: region!,
    bucket: bucket!,
  };
}

// RFC3986 encoding, keeping path separators.
function encodeRfc3986(str: string, keepSlash = false): string {
  return str
    .split(keepSlash ? "/" : "")
    .map((seg) =>
      keepSlash
        ? seg
            .split("")
            .map(encodeChar)
            .join("")
        : encodeChar(seg),
    )
    .join(keepSlash ? "/" : "");
}

function encodeChar(c: string): string {
  if (/[A-Za-z0-9\-_.~]/.test(c)) return c;
  return Array.from(new TextEncoder().encode(c))
    .map((b) => `%${b.toString(16).toUpperCase().padStart(2, "0")}`)
    .join("");
}

export function buildObjectKey(folder: string, ext: string): string {
  const clean = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+|\/+$/g, "") || "uploads";
  const safeExt = (ext || "bin").replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  return `${clean}/${randomUUID()}.${safeExt}`;
}

export function publicUrlForKey(key: string): string {
  const { bucket, region } = getS3Config();
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeRfc3986(key, true)}`;
}

/**
 * Create a short-lived PUT URL for a browser upload. The content type is part
 * of the signed request, preventing a caller from changing the intended type.
 * Credentials come from Amplify's SSR Compute role at runtime.
 */
export async function presignPutUrl(key: string, contentType: string, expiresIn = 300): Promise<string> {
  const { region, bucket } = getS3Config();
  const client = new S3Client({ region });
  return getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn },
  );
}
