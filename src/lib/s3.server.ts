import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

declare const __HULUMART_S3_BUCKET_NAME__: string;

// This is the bucket's region, not the Amplify Compute runtime region.
// Keep it independent of AWS_REGION, which describes where Compute runs.
const S3_REGION = "ap-south-2";

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
  // The build-time values make Amplify Hosting variables available in Nitro's
  // deployed Compute bundle. On other hosts, normal runtime environment
  // variables take precedence.
  const buildBucket = typeof __HULUMART_S3_BUCKET_NAME__ === "string" ? __HULUMART_S3_BUCKET_NAME__ : "";
  const configuredRegion = process.env.S3_REGION;
  if (configuredRegion && configuredRegion !== S3_REGION) {
    throw new Error(`S3_REGION must be ${S3_REGION}.`);
  }
  const bucket = process.env.S3_BUCKET_NAME || buildBucket;
  const missing = [
    ...(!bucket ? ["S3_BUCKET_NAME"] : []),
  ];
  if (missing.length) {
    throw new Error(`Missing S3 configuration: ${missing.join(", ")}`);
  }
  return {
    region: S3_REGION,
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
  let lastError: unknown;

  // On a cold Compute start, role credentials can take a moment to become
  // available. Retry once using the same Compute role, never static keys.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const client = new S3Client({ region });
      return await getSignedUrl(
        client,
        new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
        { expiresIn },
      );
    } catch (error) {
      lastError = error;
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  throw lastError;
}
