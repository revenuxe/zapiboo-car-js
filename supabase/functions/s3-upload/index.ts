import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type UploadRequest = {
  folder?: string;
  ext?: string;
  contentType?: string;
  base64?: string;
};

const encoder = new TextEncoder();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function optionalEnv(name: string): string | undefined {
  return Deno.env.get(name) || undefined;
}

function encodeRfc3986(value: string, keepSlash = false): string {
  return value
    .split(keepSlash ? "/" : "")
    .map((segment) => encodeURIComponent(segment).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`))
    .join(keepSlash ? "/" : "");
}

function buildObjectKey(folder: string, ext: string): string {
  const cleanFolder = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+|\/+$/g, "") || "uploads";
  const cleanExt = ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  return `${cleanFolder}/${crypto.randomUUID()}.${cleanExt}`;
}

function amzDates(now = new Date()) {
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const amzDate = `${iso.slice(0, 15)}Z`;
  return { amzDate, dateStamp: amzDate.slice(0, 8) };
}

function bytesToHex(bytes: ArrayBuffer | Uint8Array): string {
  return Array.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const bytes = typeof data === "string" ? encoder.encode(data) : data;
  return bytesToHex(await crypto.subtle.digest("SHA-256", bytes));
}

async function hmac(key: string | Uint8Array, data: string): Promise<Uint8Array> {
  const rawKey = typeof key === "string" ? encoder.encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data)));
}

async function signingKey(secret: string, dateStamp: string, region: string, service: string): Promise<Uint8Array> {
  const kDate = await hmac(`AWS4${secret}`, dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function sanitizeAwsError(detail: string): string {
  return detail
    .replace(/Credential=[^,<\s]+/g, "Credential=[redacted]")
    .replace(/Signature=[a-f0-9]+/gi, "Signature=[redacted]")
    .replace(/AKIA[0-9A-Z]+/g, "[redacted-access-key]");
}

async function putObjectToS3(key: string, body: Uint8Array, contentType: string): Promise<string> {
  const region = optionalEnv("AWS_REGION") || optionalEnv("AWS_DEFAULT_REGION") || "";
  const accessKeyId = env("AWS_ACCESS_KEY_ID");
  const secretAccessKey = env("AWS_SECRET_ACCESS_KEY");
  const sessionToken = optionalEnv("AWS_SESSION_TOKEN");
  const bucket = optionalEnv("AWS_BUCKET_NAME") || optionalEnv("AWS_BUCKET") || "";
  if (!region) throw new Error("Missing environment variable: AWS_REGION");
  if (!bucket) throw new Error("Missing environment variable: AWS_BUCKET_NAME");

  const service = "s3";
  const host = `${bucket}.s3.${region}.amazonaws.com`;
  const canonicalUri = `/${encodeRfc3986(key, true)}`;
  const { amzDate, dateStamp } = amzDates();
  const payloadHash = await sha256Hex(body);
  // NOTE: No "x-amz-acl" header. Modern S3 buckets disable ACLs
  // ("Bucket owner enforced"), so sending an ACL fails with
  // AccessControlListNotSupported. Public read is granted via a bucket policy.
  const headers: Record<string, string> = {
    "content-type": contentType,
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (sessionToken) headers["x-amz-security-token"] = sessionToken;

  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((name) => `${name}:${headers[name]}\n`)
    .join("");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");
  const signature = bytesToHex(await hmac(await signingKey(secretAccessKey, dateStamp, region, service), stringToSign));

  const res = await fetch(`https://${host}${canonicalUri}`, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "X-Amz-Content-Sha256": payloadHash,
      "X-Amz-Date": amzDate,
      ...(sessionToken ? { "X-Amz-Security-Token": sessionToken } : {}),
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[s3-upload] S3 error", res.status, sanitizeAwsError(detail).slice(0, 500));
    throw new Error(`S3 upload failed (${res.status}). Check Supabase function logs for details.`);
  }

  return `https://${host}${canonicalUri}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"), {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      return json({ error: "Forbidden: admin access required." }, 403);
    }

    const input = (await req.json()) as UploadRequest;
    const base64 = typeof input.base64 === "string" ? input.base64 : "";
    if (!base64) {
      return json({ error: "No image data was provided." }, 400);
    }
    if (base64.length > 10_500_000) {
      return json({ error: "Image is too large after compression." }, 413);
    }

    const contentType = typeof input.contentType === "string" ? input.contentType : "application/octet-stream";
    const key = buildObjectKey(input.folder || "uploads", input.ext || "bin");
    const publicUrl = await putObjectToS3(key, decodeBase64(base64), contentType);
    return json({ publicUrl, key });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    console.error("[s3-upload]", message);
    return json({ error: message }, 500);
  }
});
