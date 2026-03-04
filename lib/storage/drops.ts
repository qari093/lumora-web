export type DropKind = "ugc" | "trailer";

export type DropRequest = Readonly<{
  kind: DropKind;
  objectKey: string;
  ttlSec?: number;
  bucket?: string;
}>;

export type DropDecision = Readonly<{
  ok: true;
  kind: DropKind;
  objectKey: string;
  ttlSec: number;
}>;

export type DropReject = Readonly<{
  ok: false;
  error:
    | "object_key_required"
    | "object_key_invalid"
    | "bucket_public_hint_rejected"
    | "ttl_invalid";
  detail?: string;
}>;

// Canonical platform policy for drops issuance:
// 1 hour max. (Step 45 separately validates signed URL TTL policy at URL level.)
export const DROPS_TTL_MAX_SEC = 3600;

function hasPublicHint(s: string): boolean {
  const x = s.toLowerCase();
  return (
    x.includes("public") ||
    x.includes("open") ||
    x.includes("anon") ||
    x.includes("everyone") ||
    x.includes("world") ||
    x.includes("cdn-public") ||
    x.includes("public-read")
  );
}

function isSafeObjectKey(k: string): boolean {
  if (!k) return false;
  if (k.includes("://")) return false;
  if (k.includes("?") || k.includes("#")) return false;
  if (k.startsWith("/") || k.startsWith("\\")) return false;
  if (k.includes("..")) return false;
  return true;
}

export function decideDrop(req: DropRequest): DropDecision | DropReject {
  const objectKey = (req.objectKey || "").trim();
  if (!objectKey) return { ok: false, error: "object_key_required" };
  if (!isSafeObjectKey(objectKey)) return { ok: false, error: "object_key_invalid" };

  const bucket = (req.bucket || "").trim();
  if (bucket && hasPublicHint(bucket)) return { ok: false, error: "bucket_public_hint_rejected" };

  const ttlCandidate = req.ttlSec ?? DROPS_TTL_MAX_SEC;
  if (!Number.isFinite(ttlCandidate) || ttlCandidate <= 0) return { ok: false, error: "ttl_invalid" };

  const ttlSec = Math.min(Math.floor(ttlCandidate), DROPS_TTL_MAX_SEC);
  return { ok: true, kind: req.kind, objectKey, ttlSec };
}
