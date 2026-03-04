import crypto from "node:crypto";
import { clampSignedUrlTtlSeconds } from "@/lib/storage/signedUrlPolicy";

export type ContentType = "ugc" | "trailer";
export type Variant = "360p" | "480p" | "720p" | "1080p";

export type ManifestRequest = {
  contentType: ContentType;
  contentId: string;
  variant: Variant;
  viewerId?: string;
};

export type ManifestAuthDecision = {
  ok: true;
  contentType: ContentType;
  contentId: string;
  variant: Variant;
  manifestToken: string;
  ttlSeconds: number;
} | {
  ok: false;
  error: "unauthorized" | "forbidden" | "bad_request";
};

function envSecret(): string {
  const s = process.env.LUMORA_MANIFEST_SECRET;
  if (!s || s.length < 24) return "DEV_ONLY__LUMORA_MANIFEST_SECRET__CHANGE_ME__0123456789";
  return s;
}

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function hmacHex(secret: string, data: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

/**
 * Mint a short-lived manifest token.
 * The token is *only* used to authorize the manifest request.
 * Segment URLs are then signed separately and embed their own short TTL.
 */
export function mintManifestToken(input: ManifestRequest & { ttlSeconds?: number; nowMs?: number }): ManifestAuthDecision {
  const { contentType, contentId, variant, viewerId } = input;
  const nowMs = typeof input.nowMs === "number" ? input.nowMs : Date.now();
  const ttlSeconds = clampSignedUrlTtlSeconds(input.ttlSeconds ?? 60 * 60);
  if (!contentId || contentId.length < 6) return { ok: false, error: "bad_request" };

  const exp = Math.floor(nowMs / 1000) + ttlSeconds;
  const payload = {
    v: 1,
    ct: contentType,
    cid: contentId,
    var: variant,
    vid: viewerId ?? "",
    exp,
  } as const;

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64url(Buffer.from(payloadJson, "utf8"));
  const sig = hmacHex(envSecret(), payloadB64);
  const token = `${payloadB64}.${sig}`;
  return { ok: true, contentType, contentId, variant, manifestToken: token, ttlSeconds };
}

export type ManifestTokenClaims = Readonly<{
  v: 1;
  ct: ContentType;
  cid: string;
  var: Variant;
  vid: string;
  exp: number;
}>;

export function verifyManifestToken(token: string, nowMs?: number): { ok: true; claims: ManifestTokenClaims } | { ok: false; error: "unauthorized" | "expired" | "bad_request" } {
  if (!token || !token.includes(".")) return { ok: false, error: "bad_request" };
  const [payloadB64, sig] = token.split(".", 2);
  if (!payloadB64 || !sig) return { ok: false, error: "bad_request" };

  const expected = hmacHex(envSecret(), payloadB64);
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, error: "unauthorized" };

  let claims: any;
  try {
    const json = Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/") + "===", "base64").toString("utf8");
    claims = JSON.parse(json);
  } catch {
    return { ok: false, error: "bad_request" };
  }
  if (!claims || claims.v !== 1 || typeof claims.exp !== "number") return { ok: false, error: "bad_request" };

  const nowSec = Math.floor(((typeof nowMs === "number" ? nowMs : Date.now())) / 1000);
  if (claims.exp <= nowSec) return { ok: false, error: "expired" };

  return { ok: true, claims: claims as ManifestTokenClaims };
}

export type SegmentSignerInput = {
  baseUrl: string; // origin or CDN base, e.g. https://cdn.lumora.app
  path: string;    // /video/{id}/{variant}/seg-00001.m4s
  ttlSeconds?: number;
  nowMs?: number;
};

export type SignedSegmentUrl = { url: string; exp: number; ttlSeconds: number };

/**
 * Segment URLs are signed independently. The manifest token is not reused to fetch segments.
 * This supports "manifest-only auth + signed segments" with short TTL.
 */
export function signSegmentUrl(input: SegmentSignerInput): SignedSegmentUrl {
  const nowMs = typeof input.nowMs === "number" ? input.nowMs : Date.now();
  const ttlSeconds = clampSignedUrlTtlSeconds(input.ttlSeconds ?? 60 * 60);
  const exp = Math.floor(nowMs / 1000) + ttlSeconds;

  const base = input.baseUrl.replace(/\/+$/, "");
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const unsigned = `${base}${path}`;
  const toSign = `${unsigned}|exp=${exp}`;
  const sig = hmacHex(envSecret(), toSign);

  const url = `${unsigned}?exp=${exp}&sig=${sig}`;
  return { url, exp, ttlSeconds };
}

export function verifySignedSegmentUrl(url: string, nowMs?: number): { ok: true } | { ok: false; error: "unauthorized" | "expired" | "bad_request" } {
  let u: URL;
  try { u = new URL(url); } catch { return { ok: false, error: "bad_request" }; }

  const expStr = u.searchParams.get("exp");
  const sig = u.searchParams.get("sig") || "";
  const exp = expStr ? Number(expStr) : NaN;
  if (!Number.isFinite(exp) || !sig) return { ok: false, error: "bad_request" };

  const unsigned = `${u.origin}${u.pathname}`;
  const toSign = `${unsigned}|exp=${exp}`;
  const expected = hmacHex(envSecret(), toSign);

  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, error: "unauthorized" };

  const nowSec = Math.floor(((typeof nowMs === "number" ? nowMs : Date.now())) / 1000);
  if (exp <= nowSec) return { ok: false, error: "expired" };

  return { ok: true };
}
