import { createHash, createHmac, randomUUID } from "crypto";

/**
 * Minimal AWS Signature V4 presigner for S3 PUT/GET — pure Node crypto, no SDK,
 * so it runs in the TanStack/Cloudflare worker runtime. Server-only.
 */

type S3Config = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

export function getS3Config(): S3Config {
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucket = process.env.AWS_BUCKET_NAME || process.env.AWS_BUCKET;
  const missing = [
    ...(!region ? ["AWS_REGION"] : []),
    ...(!accessKeyId ? ["AWS_ACCESS_KEY_ID"] : []),
    ...(!secretAccessKey ? ["AWS_SECRET_ACCESS_KEY"] : []),
    ...(!bucket ? ["AWS_BUCKET_NAME"] : []),
  ];
  if (missing.length) {
    throw new Error(`Missing AWS S3 env var(s): ${missing.join(", ")}`);
  }
  return {
    region: region!,
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
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

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

function amzDates(now = new Date()) {
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const amzDate = iso.slice(0, 15) + "Z"; // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8); // YYYYMMDD
  return { amzDate, dateStamp };
}

function signingKey(secret: string, dateStamp: string, region: string, service: string) {
  const kDate = hmac(`AWS4${secret}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
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
 * Create a presigned PUT URL the browser can upload to directly.
 * Only `host` is signed, so the client may send any Content-Type header.
 */
export function presignPutUrl(key: string, expiresIn = 900): string {
  const { region, accessKeyId, secretAccessKey, bucket } = getS3Config();
  const service = "s3";
  const host = `${bucket}.s3.${region}.amazonaws.com`;
  const { amzDate, dateStamp } = amzDates();
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalUri = "/" + encodeRfc3986(key, true);

  const params: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresIn),
    "X-Amz-SignedHeaders": "host",
  };

  const canonicalQuerystring = Object.keys(params)
    .sort()
    .map((k) => `${encodeRfc3986(k)}=${encodeRfc3986(params[k])}`)
    .join("&");

  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = "host";
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const key2 = signingKey(secretAccessKey, dateStamp, region, service);
  const signature = createHmac("sha256", key2).update(stringToSign, "utf8").digest("hex");

  return `https://${host}${canonicalUri}?${canonicalQuerystring}&X-Amz-Signature=${signature}`;
}
