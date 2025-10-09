import { S3Client } from "@aws-sdk/client-s3";

export function getS3() {
  const region = process.env.S3_REGION || "auto";
  const endpoint = process.env.S3_ENDPOINT || undefined;
  const forcePathStyle = (process.env.S3_FORCE_PATH_STYLE || "true").toLowerCase() === "true"; // safer for R2/MinIO
  const credentials = (process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY)
    ? { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! }
    : undefined;
  return new S3Client({ region, endpoint, forcePathStyle, credentials });
}

export function requireBucket(): string {
  const b = process.env.S3_BUCKET;
  if (!b) throw new Error("Missing S3_BUCKET");
  return b;
}
