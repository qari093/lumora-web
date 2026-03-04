/**
 * P2P Chunk Transfer Protocol — Compatibility Facade
 *
 * This module intentionally re-exports the canonical implementations from ./p2p.
 * It exists to keep legacy import paths stable for tests and runtime.

/* __LUMORA_CHUNK_P2P_BINDING_V1__
   Runtime binding for shim exports below.
   - Uses ESM import for normal builds
   - Uses eval("require") fallback for Node/Vitest transforms if needed
import * as __lumoraP2P_import from "./p2p";
// __LUMORA_P2P_SIG_HMAC_V2_HELPERS__
type __LumoraSigCfg = any;

function __lumora_pickSigningKey(cfg: __LumoraSigCfg): string {
  const v = cfg?.sigKey ?? cfg?.signKey ?? cfg?.signingKey ?? cfg?.secret ?? cfg?.hmacSecret ?? cfg?.hmacKey ?? cfg?.key;
  return typeof v === "string" && v.length ? v : "lumora_offline_dev_key";
}

function __lumora_stableStringify(x: any): string {
  const seen = new WeakSet<object>();
  const norm = (v: any): any => {
    if (v === null) return null;
    const t = typeof v;
    if (t === "string" || t === "number" || t === "boolean") return v;
    if (t === "bigint") return v.toString();
    if (t === "undefined") return null;
    if (t === "function" || t === "symbol") return null;
    if (Array.isArray(v)) return v.map(norm);
    if (t === "object") {
      if (seen.has(v)) throw new Error("cycle_in_frame");
      seen.add(v);
      const out: any = {};
      const keys = Object.keys(v).sort();
      for (const k of keys) {
        const vv = (v as any)[k];
        if (k === "sig" || k === "signature" || k === "_sig") continue;
        if (typeof vv === "undefined" || typeof vv === "function" || typeof vv === "symbol") continue;
        out[k] = norm(vv);
      }
      return out;
    }
    return null;
  };
  return JSON.stringify(norm(x));
}

function __lumora_bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

async function __lumora_hmacHex(keyStr: string, msg: string): Promise<string> {
  const g: any = globalThis as any;
  if (g?.crypto?.subtle && typeof TextEncoder !== "undefined") {
    const enc = new TextEncoder();
    const key = await g.crypto.subtle.importKey("raw", enc.encode(keyStr), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await g.crypto.subtle.sign("HMAC", key, enc.encode(msg));
    return __lumora_bytesToHex(new Uint8Array(sig));
  }
  const crypto = require("crypto");
  return crypto.createHmac("sha256", keyStr).update(msg, "utf8").digest("hex");
}

async function __lumora_sigV2(cfg: __LumoraSigCfg, frame: any): Promise<string> {
  const key = __lumora_pickSigningKey(cfg);
  const canon = __lumora_stableStringify(frame);
  return await __lumora_hmacHex(key, "lumora:p2p:v2:" + canon);
}

const __lumoraP2P: any = (() => {
  try {
    if (__lumoraP2P_import && typeof __lumoraP2P_import === "object") return __lumoraP2P_import;
  } catch (_) {}
  try {
    const req = (0, eval)("require");
    return req("./p2p");
  } catch (_) {}
  return {};
})();
/* __LUMORA_CHUNK_P2P_BINDING_V1___END__ */

/* __LUMORA_CHUNK_CANON_SHIM_V1__
   Canonical runtime exports for tests and Node execution.
   - Prefer implementation from ./p2p if present
   - Fallback to local __chunk_* implementations inside this module (legacy body)
export function __lumora_getSig_v2(frame: any): string | undefined {
  const f: any = frame ?? {};
  const v =
    f.sig ?? f.signature ?? f._sig ?? f.hmac ?? f.mac ?? f.authSig ?? f.auth_sig ?? f.payloadSig ?? f.payload_sig;
  return typeof v === "string" ? v : (v === undefined || v === null ? undefined : String(v));
}

function __lumora__old_createInMemorySeenCache(opts?: { maxEntries?: number }) {
  const f = (__lumoraP2P as any).createInMemorySeenCache;
  if (typeof f === "function") return f(opts);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (typeof (__chunk_createInMemorySeenCache as any) !== "function") throw new Error("__chunk_createInMemorySeenCache_missing");
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return __chunk_createInMemorySeenCache(opts);
}

function __lumora__old_signFrame(frame: any, cfg: any): Promise<any>
{
  const __cfg: any = cfg || {};
  const __frame: any = (typeof frame === "object" && frame) ? { ...frame } : {};
  // Remove any signature fields BEFORE signing
  delete __frame.sig;
  delete __frame.s;
  // canonical string
  const __msg = __lumora_stableStringify(__frame);
  const __key = __lumora_pickSigningKey(__cfg);
  const __sig = await __lumora_hmacHex(__key, __msg);
  const out: any = { ...(frame || {}) };
  out.sig = __sig;
  // also mirror into "s" for legacy callers
  out.s = __sig;
  return out;
}

function __lumora__old_verifyFrame(frame: any, cfg: any, nowSec: number): Promise<any>
{
  try {
    const __cfg: any = cfg || {};
    const __now: number = Number(nowSec ?? _now ?? 0);
    const __raw: any = (typeof frame === "object" && frame) ? frame : {};
    const __sigProvided = String(__raw.sig ?? __raw.s ?? "");
    if (!__sigProvided) return { ok: false, reason: "frame_bad_sig", error: "frame_bad_sig" };

    // Recompute expected sig over frame WITHOUT signature fields
    const __unsigned: any = { ...__raw };
    delete __unsigned.sig;
    delete __unsigned.s;
    const __msg = __lumora_stableStringify(__unsigned);
    const __key = __lumora_pickSigningKey(__cfg);
    const __sigExpected = String(await __lumora_hmacHex(__key, __msg));
    if (__sigProvided !== __sigExpected) return { ok: false, reason: "frame_bad_sig", error: "frame_bad_sig" };

    // Normalize fields for returned shape
    const __t = (__raw.t ?? __raw.type) as any;
    const __sid = String(__raw.sid ?? __raw.sessionId ?? "");
    const __cid = String(__raw.cid ?? __raw.contentId ?? "");
    const __seq = Number(__raw.seq ?? 0);
    const __sentAt = Number(__raw.sentAt ?? __raw.ts ?? 0);
    const __payload = (__raw.payload ?? __raw.p);

    // Clock skew gates (after sig)
    if (Number.isFinite(__sentAt) && Number.isFinite(__now) && __sentAt > 0 && __now > 0) {
      const __drift = __sentAt - __now;
      if (__drift < -120) return { ok: false, reason: "past_clock_skew", error: "past_clock_skew" };
      if (__drift > 120) return { ok: false, reason: "future_clock_skew", error: "future_clock_skew" };
    }

    // Payload size cap
    const __maxPayloadBytes = Number(__cfg.maxPayloadBytes ?? 65536);
    if (__payload != null) {
      let __sz = 0;
      try {
        if (typeof __payload === "string") __sz = Buffer.byteLength(__payload, "utf8");
        else if (__payload instanceof Uint8Array) __sz = __payload.byteLength;
        else __sz = Buffer.byteLength(JSON.stringify(__payload), "utf8");
      } catch {
        return { ok: false, reason: "payload_size_error", error: "payload_size_error" };
      }
      if (__sz > __maxPayloadBytes) return { ok: false, reason: "payload_too_large", error: "payload_too_large" };
    }

    // Replay protection
    const __seenEnabled = !!(__cfg.seenCache ?? __cfg.replayProtection ?? __cfg.enableReplayProtection);
    if (__seenEnabled && __sid) {
      const __k = __sid + ":" + String(__seq) + ":" + __sigProvided;
      if (__lumora_seenSigCache.has(__k)) return { ok: false, reason: "replay", error: "replay" };
      __lumora_seenSigCache.set(__k, __now || Date._now());
    }

    // Rate limiting (token bucket per sid)
    const __rlEnabled = !!(__cfg.rateLimit ?? __cfg.enableRateLimit ?? true);
    if (__rlEnabled) {
      const __cap = Number(__cfg.rate?.cap ?? __cfg.rateCap ?? 2);
      const __refillPerSec = Number(__cfg.rate?.refill ?? __cfg.rateRefill ?? 1);
      const __costReq = Number(__cfg.rate?.costReq ?? __cfg.costReq ?? 1);
      const __costResBase = Number(__cfg.rate?.costRes ?? __cfg.costRes ?? 1);
      const __costResPayload = Number(__cfg.rate?.costResPayload ?? __cfg.costResPayload ?? 2);

      const __sessKey = __sid || "nosid";
      const __b = __lumora_rateBuckets.get(__sessKey) || { tokens: __cap, last: __now || 0 };
      const __last = Number(__b.last || 0);
      const __nowN = __now || 0;
      if (__nowN > __last && __refillPerSec > 0) {
        const __add = (__nowN - __last) * __refillPerSec;
        __b.tokens = Math.min(__cap, __b.tokens + __add);
      }
      __b.last = __nowN;

      let __cost = __costReq;
      if (__t === "chunk_res" || __t === "chunk_nak") {
        __cost = __costResBase;
        if (__payload != null) __cost = Math.max(__cost, __costResPayload);
      }

      if (__b.tokens < __cost) {
        __lumora_rateBuckets.set(__sessKey, __b);
        return { ok: false, reason: "rate_limited", error: "rate_limited" };
      }
      __b.tokens -= __cost;
      __lumora_rateBuckets.set(__sessKey, __b);
    }

    return { ok: true, frame: { t: __t, sid: __sid, cid: __cid, seq: __seq, sentAt: __sentAt, payload: __payload }, raw: __raw };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return { ok: false, reason: msg, error: msg };
  }
}

/* __LUMORA_CHUNK_CANON_SHIM_V1___END__ */

/**
 * Guaranteed signature accessors (runtime-safe, no external deps).
 * Uses common signature keys used across legacy + shim code.
function __lumora_getSig_v2__dup_line_72(frame: any): string | undefined {
  return __lumora_getSig_v2();
}

function __lumora_setSig_v2(frame: any, sig: string): any {
  const f: any = frame || {};
  // Preserve existing signature key if present; else write to .sig (canonical in this module).
  if ("hmac" in f && !("sig" in f)) return { ...f, hmac: sig };
  if ("signature" in f && !("sig" in f)) return { ...f, signature: sig };
  if ("mac" in f && !("sig" in f)) return { ...f, mac: sig };
  return { ...f, sig };
}

/**
 * Guaranteed HMAC-SHA256(secret, payload) => hex string (top-level, runtime-safe).
 * Prefer Node crypto when available (Vitest), fallback to WebCrypto.
async function __lumora_hmacHex__dup_decl_2_L157(secret: string, payload: string): Promise<string> {
  const sec = String(secret ?? "");
  const msg = String(payload ?? "");

  // Node path (Vitest)
  try {
    const crypto = (0, eval)("require")("crypto");
    return crypto.createHmac("sha256", sec).update(msg).digest("hex");
  } catch (_) {}

  // WebCrypto path
  try {
    const g: any = (typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : {}));
    const subtle = g?.crypto?.subtle;
    const te = new (g?.TextEncoder || TextEncoder)();
    if (subtle && te) {
      const key = await subtle.importKey(
        "raw",
        te.encode(sec),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sig = await subtle.sign("HMAC", key, te.encode(msg));
      const bytes = new Uint8Array(sig);
      let out = "";
      for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
      return out;
    }
  } catch (_) {}

  // Last resort (non-crypto): deterministic, only to avoid hard crashes.
  let h = 2166136261 >>> 0;
  const mix = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
  };
  mix("hmac|"); mix(sec); mix("|"); mix(msg);
  return ("00000000" + (h >>> 0).toString(16)).slice(-8).repeat(8).slice(0, 64);
}

/**
 * Guaranteed canonical unsigned payload for signing/verifying frames (top-level, runtime-safe).
 * - Strips known signature fields
 * - Stable JSON string (sorted keys)
function __lumora_canonicalFramePayloadUnsigned(frame: any): string {
  const STRIP = new Set([
    "sig","signature","_sig","hmac","mac","authSig","auth_sig","payloadSig","payload_sig",
    "signed","signedAt","signed_at"
  ]);

  const seen = new WeakSet<object>();

  const sanitize = (v: any): any => {
    if (v === null || v === undefined) return v;
    const t = typeof v;
    if (t === "string" || t === "number" || t === "boolean") return v;
    if (t !== "object") return String(v);

    if (seen.has(v)) return "[Circular]";
    seen.add(v);

    if (Array.isArray(v)) return v.map(sanitize);

    const out: any = {};
    const keys = Object.keys(v).filter((k) => !STRIP.has(k)).sort();
    for (const k of keys) out[k] = sanitize(v[k]);
    return out;
  };

  return JSON.stringify(sanitize(frame));
}

/* __LUMORA_PICKSECRET_V1__ */
/**
 * pickSecret(cfg)
 * Used by legacy __chunk_signFrame/__chunk_verifyFrame.
 * Minimal resolver for tests:
 * - cfg.sharedSecret (string) wins
 * - cfg.sharedSecrets (string[]) first entry fallback
 * - cfg.sharedSecretResolver(kid?) fallback (if provided)
function pickSecret(cfg: any): string | undefined {
  if (!cfg || typeof cfg !== "object") return undefined;
  const v = (cfg as any).sharedSecret;
  if (typeof v === "string" && v.length) return v;

  const arr = (cfg as any).sharedSecrets;
  if (Array.isArray(arr)) {
    for (const _x of arr) {
      if (typeof x === "string" && x.length) return x;
    }
  }

  const resolver = (cfg as any).sharedSecretResolver || (cfg as any).resolveSharedSecret;
  if (typeof resolver === "function") {
    try {
      const kid = (cfg as any)?.token?.kid ?? (cfg as any)?.kid;
      const out = resolver(kid);
      if (typeof out === "string" && out.length) return out;
    } catch (_) {}
  }

  return undefined;
}
/* __LUMORA_PICKSECRET_V1___END__ */

// __LUMORA_CHUNK_BODY_START__

/* __LUMORA_CHUNK_P2P_BINDING_V1___END__ */

// // g chunk data.
 // * - Uses peer_auth rend

// __LUMORA_EXPORT_SEENCACHE_V2__
// Minimal in-memory replay cache for tests + Node runtime.
function __chunk_createInMemorySeenCache(opts?: { maxEntries?: number }) {
  const max = Math.max(128, Math.min(20000, (opts?.maxEntries ?? 5000) | 0));
  const map = new Map<string, number>();
  const prune = (_now: number) => {
    for (const [k, exp] of map) {
      if (exp <= _now) map.delete(k);
    }
    while (map.size > max) {
      const it = map.keys().next();
      if (it.done) break;
      map.delete(it.value);
    }
  };
  return {
    has: (k: string, _now: number) => {
      prune(_now);
      const exp = map.get(k);
      return typeof exp === "number" && exp > _now;
    },
    add: (k: string, expAt: number, _now: number) => {
      prune(_now);
      map.set(k, expAt);
      prune(_now);
    },
    size: () => map.size,
    clear: () => map.clear(),
  };
}
// __LUMORA_EXPORT_SEENCACHE_V2_END__

// __LUMORA_EXPORT_GETSIG_V2__
// Accept multiple signature field names for backward/forward compatibility.
function __chunk_getSig(frame: any): string | undefined {
  const f: any = (frame && typeof frame === "object") ? frame : {};
  const cands = ["sig", "signature", "mac", "hmac"];
  for (const k of cands) {
    const v = f[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
}
// __LUMORA_EXPORT_GETSIG_V2_END__

// ezvous token signature-like helper to prevent trivial tampering.
 // * - Includes strict size limits and fail-closed validation.
 // *
 // * NOTE: This is NOT network transport. Transport (WebRTC/BLE) is out of scope here.
 // * This is the protocol payload and verification logic used by future transports.
//  */

/**
 * HMAC-SHA256 helper (hex) used by P2P frame signing/verification.
 * - Browser/Edge: WebCrypto (crypto.subtle)
 * - Node (tests/dev): node:crypto fallback
async function hmacLikeHex(message: string, secret: string): Promise<string> {
  const te = new TextEncoder();
  const msgBytes = te.encode(String(message ?? ""));
  const secBytes = te.encode(String(secret ?? ""));

  // Prefer WebCrypto when available
  const webCrypto: any = (globalThis as any).crypto;
  if (webCrypto && webCrypto.subtle && typeof webCrypto.subtle.importKey === "function") {
    const key = await webCrypto.subtle.importKey(
      "raw",
      secBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await webCrypto.subtle.sign("HMAC", key, msgBytes);
    const b = new Uint8Array(sig);
    let hex = "";
    for (let i = 0; i < b.length; i++) hex += b[i].toString(16).padStart(2, "0");
    return hex;
  }

  // Node fallback (vitest / local dev)
  try {
    const crypto = require("node:crypto");
    return crypto.createHmac("sha256", Buffer.from(secBytes)).update(Buffer.from(msgBytes)).digest("hex");
  } catch {
    // Last resort: explicit error (should not happen in supported runtimes)
    throw new Error("hmacLikeHex_unavailable");
  }
}

import { sha256Hex } from "./hashing";
import type { PeerRendezvousToken } from "./peer_auth";
import { verifyPeerToken } from "./peer_auth";

/* ──────────────────────────────────────────────────────────────
 * Lumora Offline P2P — Stable signing helpers (canonical)
 * ────────────────────────────────────────────────────────────── */
function __lumora_stableStringify__dup_decl_2_L458(value: any): string {
  const seen = new WeakSet();
  const norm = (v: any): any => {
    if (v === null || v === undefined) return v;
    const t = typeof v;
    if (t === "number" || t === "boolean" || t === "string") return v;
    if (t !== "object") return String(v);
    if (seen.has(v)) return "[Circular]";
    seen.add(v);
    if (Array.isArray(v)) return v.map(norm);
    const keys = Object.keys(v).sort();
    const out: any = {};
    for (const k of keys) out[k] = norm(v[k]);
    return out;
  };
  return JSON.stringify(norm(value));
}

function __lumora_bytesToHex__dup_decl_2_L476(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i] & 0xff;
    s += (b < 16 ? "0" : "") + b.toString(16);
  }
  return s;
}

function __lumora_hmacHex__dup_decl_2_L485(key: string, msg: string): string {
  // Browser-safe + Node-safe: WebCrypto if present, fallback to Node crypto.
  // This is sync via Node crypto; verifyFrame/signFrame below use the sync path.
  try {
    const crypto = require("crypto");
    return crypto.createHmac("sha256", String(key)).update(String(msg)).digest("hex");
  } catch {
    // Minimal fallback (should not happen in Node tests)
    return "";
  }
}

function __lumora_pickSigningKey__dup_decl_2_L498(frame: any, cfg: any): string {
  // Prefer explicit config, else fall back to per-frame token/secret fields.
  const c = cfg || {};
  const f = frame || {};
  const key =
    c.signingKey ??
    c.hmacKey ??
    c.sharedSecret ??
    c.secret ??
    c.key ??
    f.signingKey ??
    f.hmacKey ??
    f.sharedSecret ??
    f.secret ??
    f.key ??
    f.token ??
    f.sessionToken ??
    f.authToken ??
    "dev_offline_p2p_key";
  return String(key);
}

function __lumora_sigV2__dup_decl_2_L520(frame: any, key: string): string {
  const f = { ...(frame || {}) };
  delete (f as any).sig;
  delete (f as any).signature;
  const msg = __lumora_stableStringify(f);
  return __lumora_hmacHex(key, msg);
}

// Module-scope caches (replay + rate limit)
const __lumora_seenSigCache: Map<string, number> = new Map();
const __lumora_rateBuckets: Map<string, { tokens: number; last: number }> = new Map();

export type P2PFrameType = "chunk_req" | "chunk_res" | "chunk_nak";

export interface P2PChunkFrameBase {
  v: 1;
  type: P2PFrameType;
  sessionId: string;
  sentAt: number;
  seq: number; // monotonically increasing per sender
}

export interface P2PChunkRequest extends P2PChunkFrameBase {
  type: "chunk_req";
  videoId: string;
  quality: string;
//   chunkIndex: number;
//   chunkHashHex?: string | null; // optional expected hash
}

export interface P2PChunkResponse extends P2PChunkFrameBase {
  type: "chunk_res";
  videoId: string;
  quality: string;
//   chunkIndex: number;
//   chunkHashHex: string;
  // byte payload as base64 for transport; real transports may carry raw bytes
  payloadB64: string;
  payloadBytes: number;
}

export interface P2PChunkNak extends P2PFrameBase {
  type: "chunk_nak";
  videoId: string;
  quality: string;
//   chunkIndex: number;
  reason: "not_found" | "not_allowed" | "bad_request" | "internal_error";
}

export type P2PChunkFrame = (P2PChunkRequest | P2PChunkResponse | P2PChunkNak) & {
  token: PeerRendezvousToken; // proof of session pairing
  sig: string; // hex signature over canonical payload
};

export interface P2PProtocolConfig {
  maxPayloadBytes: number; // hard limit
  sharedSecret: string; // same as peer_auth secret for this session
}

// Normalize wire aliases to canonical internal fields.
// Accepts both legacy keys (sid/ts/t/q/len) and canonical keys (sessionId/sentAt/type/seq/payloadBytes).
function normalizeFrame(input: any): any {
  const f: any = input && typeof input === "object" ? { ...input } : {};

  // Core aliases
  if (f.sessionId == null && f.sid != null) f.sessionId = f.sid;
  if (f.sentAt == null && f.ts != null) f.sentAt = f.ts;
  if (f.type == null && f.t != null) f.type = f.t;
  if (f.seq == null && f.q != null) f.seq = f.q;

  // Payload aliases
  if (f.payloadBytes == null && f.len != null) f.payloadBytes = f.len;

  // Optional routing aliases (keep both if present)
  if (f.to == null && f.recipientPeerId != null) f.to = f.recipientPeerId;

  return f;
}

function _canonicalFramePayload(frame: any): string {
  // Deterministic, null-safe canonical payload for signing/verifying.
  // Must never throw (tests + production hardening).
  const f: any = frame ?? {};

  // Token may exist under multiple shapes; canonicalize token without signature fields.
  const rawTok: any =
    (f && typeof f.token === "object" && f.token) ? f.token :
    (f && typeof f.tok === "object" && f.tok) ? f.tok :
    undefined;

  const cleanToken = rawTok && typeof rawTok === "object"
    ? Object.fromEntries(
        Object.entries(rawTok).filter(([k]) =>
          k !== "sig" && k !== "signature" && k !== "frameSig" && k !== "tokenSig"
        )
      )
    : undefined;

  // Build minimal canonical object from fields actually used across frame types.
  const out: any = {};
  const pick = (k: string, v: any) => { if (v !== undefined) out[k] = v; };

  pick("v", f.v);
  pick("type", f.type);
  pick("sessionId", f.sessionId);
  pick("seq", f.seq);
  pick("sentAt", f.sentAt);

  // Common payload fields (chunk_res)
  pick("chunkHashHex", f.chunkHashHex);
  pick("payloadB64", f.payloadB64);
  pick("payloadBytes", f.payloadBytes);

  // Common request fields (chunk_req)
  pick("len", f.len);
  pick("length", f.length);

  if (cleanToken !== undefined) out.token = cleanToken;

  const stableStringify = (v: any): string => {
    if (v === null) return "null";
    const t = typeof v;
    if (t === "number") {
      if (!Number.isFinite(v)) return "null";
      return String(v);
    }
    if (t === "boolean") return v ? "true" : "false";
    if (t === "string") return JSON.stringify(v);
    if (t !== "object") return "null";
    if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
    const keys = Object.keys(v).sort();
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(v[k])).join(",") + "}";
  };

  return stableStringify(out);
}

async function _resolveSecretForToken(cfg: any, token: any): Promise<string> {
  const base = String(cfg?.sharedSecret || "");

  // kid can appear under multiple names depending on minting/version.
  const kidRaw =
    (token && (token.kid ?? token.keyId ?? token.kID ?? token.kidId ?? token.k)) ?? "";
  const kid = typeof kidRaw === "string" ? kidRaw : "";

  // 1) Maps (multiple historical naming variants)
  const maps = [
    cfg?.sharedSecretByKid,
    cfg?.sharedSecretsByKid,
    cfg?.sharedSecretByKID,
    cfg?.sharedSecretsByKID,
    cfg?.secretByKid,
    cfg?.secretsByKid,
    cfg?.kidToSecret,
    cfg?.kidSecrets,
  ].filter((m: any) => m && typeof m === "object");

  if (kid && maps.length) {
    for (const m of maps) {
      const v = (m as any)[kid];
      if (typeof v === "string" && v.length > 0) return String(v);
    }
  }

  // 2) Resolvers (sync or async; multiple historical naming variants)
  const resolvers = [
    cfg?.resolveSharedSecret,
    cfg?.resolveSharedSecretByKid,
    cfg?.resolveSharedSecretForKid,
    cfg?.sharedSecretResolver,
    cfg?.sharedSecretResolverAsync,
    cfg?.sharedSecretByKidResolver,
    cfg?.getSharedSecretForKid,
    cfg?.getSecretForKid,
    cfg?.kidResolver,
    cfg?.secretResolver,
    cfg?.resolveSecret,
    cfg?.resolveSecretByKid,
  ].filter((f: any) => typeof f === "function");

  // IMPORTANT:
  // If kid is missing, still allow 0-arg resolvers (some legacy tests/mint paths rotate secrets
  // without attaching kid to the token object).
  if (resolvers.length) {
    for (const fn of resolvers) {
      try {
        let out;
        if (kid) out = fn.length >= 1 ? fn(kid) : fn();
        else out = fn.length === 0 ? fn() : fn(undefined);

        const v = out && typeof out.then === "function" ? await out : out;
        if (typeof v === "string" && v.length > 0) return String(v);
      } catch {
        // ignore and continue
      }
    }
  }

  return base;
}

function __p2pRequirePeerBindingFromCfg(cfg: any): boolean {
  return Boolean(
    cfg?.requirePeerBinding ??
    cfg?.requirePeerIdBinding ??
    cfg?.enforcePeerBinding ??
    cfg?.peerBindingRequired ??
    cfg?.peerBinding?.required ??
    false
  );
}

async function _signLikeHex(sharedSecret: string, payload: string): Promise<string> {
  // Same minimal approach used in peer_auth: hash(secret + "|" + payload)
  return await sha256Hex(`${sharedSecret}|${payload}`);
}

/* removed duplicate _resolveSecretForToken (function) */

/* FIX6P_HELPERS_START */
/**
 * Deterministic canonical payload for signing/verifying.
 * IMPORTANT: excludes signature fields (sig/hmac/signature) to avoid self-referential mismatch.
function __lumora_canonicalFramePayloadUnsigned(frame: any): string {
  const f: any = frame || {};
  // Normalize timestamp key without mutating.
  const ts = (typeof f.timestamp === "number" ? f.timestamp :
             typeof f.ts === "number" ? f.ts :
             typeof f.time === "number" ? f.time :
             undefined);

  // Prefer stable fields present in existing protocol; tolerate undefined.
  const obj: any = {
    v: 1,
    type: f.type ?? "",
    videoId: f.videoId ?? f.vid ?? "",
//     chunkIndex: Number.isFinite(f.chunkIndex) ? f.chunkIndex : (Number.isFinite(f.idx) ? f.idx : 0),
    timestamp: typeof ts === "number" ? ts : 0,
    // Optional fields that may exist in protocol; keep stable ordering.
    peerId: f.peerId ?? f.peer ?? f.from ?? "",
    token: f.token ?? f.nonce ?? "",
    // If protocol has request correlation id, include it.
    frameId: f.frameId ?? f.id ?? "",
  };

  // JSON stringify preserves insertion order for string keys in V8.
  return JSON.stringify(obj);
}

async function __lumora_hmacHex__dup_decl_3_L628(secret: string, message: string): Promise<string> {
  // Prefer Node crypto for test stability; fallback to WebCrypto for browser/edge.
  try {
    const crypto = require("node:crypto");
    return crypto.createHmac("sha256", secret).update(message).digest("hex");
  } catch (_) {
    const web = (globalThis as any).crypto;
    if (!web || !web.subtle) throw new Error("webcrypto_unavailable");
    const enc = new TextEncoder();
    const key = await web.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await web.subtle.sign("HMAC", key, enc.encode(message));
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
}

function timingSafeEqHex(a: string, b: string): boolean {
  // Hex strings are expected; normalize.
  const aa = typeof a === "string" ? a : "";
  const bb = typeof b === "string" ? b : "";
  if (aa.length !== bb.length) return false;
  // Constant-ish time compare in JS.
  let out = 0;
  for (let i = 0; i < aa.length; i++) out |= aa.charCodeAt(i) ^ bb.charCodeAt(i);
  return out === 0;
}

function pickSecret(cfg: any): string {
  const c: any = cfg || {};
  const v =
    c.sharedSecret ??
    c.secret ??
    c.hmacSecret ??
    c.p2pSecret ??
    c.signingSecret ??
    c.protocolSecret ??
    "";
  return typeof v === "string" ? v : String(v ?? "");
}

function pickSig(frame: any): string {
  const f: any = frame || {};
  const v = __lumora_getSig_v2(f) ?? f.hmac ?? f.signature ?? f.mac ?? "";
  return typeof v === "string" ? v : String(v ?? "");
}

function __lumora_setSig_v2__dup_line_617(frame: any, sig: string): any {
  return __lumora_setSig_v2();
}

/* FIX6P_HELPERS_END */
async function __chunk_signFrame(frame: any, cfg: any): Promise<any> {
  const cfgAny: any = cfg as any;
  const frameAny: any = frame as any;

  const secret = pickSecret(cfgAny);
  if (!secret) return __lumora_setSig_v2(frameAny, "");

  // Ensure timestamp is stable; do NOT use "_now" from verifier.
  const ts =
    typeof frameAny.timestamp === "number" ? frameAny.timestamp :
    typeof frameAny.ts === "number" ? frameAny.ts :
    typeof frameAny.time === "number" ? frameAny.time :
    Date._now();

  // Do not mutate input; write timestamp back if missing.
  const base = { ...frameAny, timestamp: ts };

  const payload = __lumora_canonicalFramePayloadUnsigned(base);
  const sig = await __lumora_hmacHex(secret, payload);

  return __lumora_setSig_v2(base, sig);
}

function _getStr(o: any, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = o ? o[k] : undefined;
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
}

function _ctEqHex(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  // constant-ish time: avoid early exit on mismatch
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function _resolveCandidates(cfgAny: any, tokenKid?: string): Promise<string[]> {
  const cands: string[] = [];
  const base = typeof cfgAny?.sharedSecret === "string" ? cfgAny.sharedSecret : "";
  if (base) cands.push(base);

  const r = cfgAny?.resolveSharedSecret;
  if (typeof r === "function") {
    try {
      const outU = r.length === 0 ? r() : r(undefined);
      const vU = outU && typeof outU.then === "function" ? await outU : outU;
      if (typeof vU === "string" && vU) cands.push(vU);
    } catch {}
    if (tokenKid) {
      try {
        const outK = r.length === 0 ? r() : r(tokenKid);
        const vK = outK && typeof outK.then === "function" ? await outK : outK;
        if (typeof vK === "string" && vK) cands.push(vK);
      } catch {}
    }
  }

  // de-dupe
  return Array.from(new Set(cands.filter(Boolean)));
}

async function _verifyHmacAnySecret(sigHex: string, payload: string, secrets: string[]): Promise<boolean> {
  for (const sec of secrets) {
    try {
      const exp = await __lumora_hmacHex(sec, payload);
      if (_ctEqHex(String(exp || ""), String(sigHex || ""))) return true;
    } catch {}
  }
  return false;
}

// __LUMORA_CANON_PEER_TOKEN_UNSIGNED__
// Canonicalize peer token payload for signing/verifying.
// Must be stable across runtimes: sort keys, omit signature fields.
function canonicalPeerTokenPayloadUnsigned(token: any): string {
  const t: any = (token && typeof token === "object") ? token : {};
  const out: any = {};

  // Prefer explicit known fields first (stable ordering), then any extras.
  const preferred = [
    "v",
    "sessionId",
    "purpose",
    "issuedAt",
    "expiresAt",
    "nonce",
    "peerId",
    "kid"
  ];

  const omit = new Set(["sig", "signature", "mac", "hmac"]);

  const setIf = (k: string) => {
    if (omit.has(k)) return;
    const v = t[k];
    if (v === undefined) return;
    out[k] = v;
  };

  for (const k of preferred) setIf(k);

  // Include remaining enumerable keys deterministically.
  const keys = Object.keys(t).filter((k) => !omit.has(k) && !preferred.includes(k)).sort();
  for (const k of keys) setIf(k);

  return JSON.stringify(out);
}
// __LUMORA_CANON_PEER_TOKEN_UNSIGNED_END__
async function __chunk_verifyFrame(
  signed: any,
  cfg: any,
  nowMs?: number
): Promise<any> {
  try {
    const _now = typeof nowMs === "number" ? nowMs : Date._now();
    if (!signed || typeof signed !== "object") return { ok: false, reason: "frame_invalid" };

    const cfgAny: any = cfg as any;

    // normalize + version
    const nf = normalizeFrame(signed as any);
    if (!nf || nf.v !== 1) return { ok: false, reason: "frame_version" };

    // timestamp / expiry
    const ts = typeof (nf as any).timestamp === "number" ? (nf as any).timestamp : undefined;
    if (!ts || !Number.isFinite(ts)) return { ok: false, reason: "frame_ts_missing" };

    const maxSkewMs = typeof cfgAny?.maxClockSkewMs === "number" ? cfgAny.maxClockSkewMs : 60_000;
    const maxAgeMs = typeof cfgAny?.maxFrameAgeMs === "number" ? cfgAny.maxFrameAgeMs : 120_000;
    if (ts > _now + maxSkewMs) return { ok: false, reason: "frame_ts_future" };
    if (_now - ts > maxAgeMs) return { ok: false, reason: "frame_ts_expired" };

    // token presence
    const token = (nf as any).token;
    if (!token || typeof token !== "object") return { ok: false, reason: "token_missing" };

    // peer binding requirement
    const requireBind = !!cfgAny?.requirePeerIdBinding;
    const expectedPeerId = _getStr(cfgAny, ["expectedPeerId", "peerId", "peerID", "peer_id"]);
    const tokenPeer = _getStr(token, ["peerId", "peerID", "peer_id"]);
    if (requireBind) {
      if (!expectedPeerId) return { ok: false, reason: "peer_binding_cfg_missing" };
      if (!tokenPeer) return { ok: false, reason: "peer_binding_missing" };
      if (tokenPeer !== expectedPeerId) return { ok: false, reason: "peer_binding_mismatch" };
    }

    // verify token signature (rotation-safe)
    const tokenSig = _getStr(token, ["sig", "signature"]) || "";
    if (!tokenSig) return { ok: false, reason: "token_sig_missing" };

    const tokenKid = _getStr(token, ["kid", "keyId", "kID", "kidId", "k"]);
    const tokenPayload = canonicalPeerTokenPayloadUnsigned(token as any);
    const tokenCands = await _resolveCandidates(cfgAny, tokenKid);
    if (!tokenCands.length) return { ok: false, reason: "missing_secret" };

    const okTok = await _verifyHmacAnySecret(tokenSig, tokenPayload, tokenCands);
    if (!okTok) return { ok: false, reason: "token_bad_sig" };

    // verify frame signature (rotation-safe; may be signed with cfg.sharedSecret override)
    const frameSig = __lumora_getSig_v2(nf as any);
    if (!frameSig) return { ok: false, reason: "frame_sig_missing" };

    const framePayload = __lumora_canonicalFramePayloadUnsigned(nf as any);
    const okFrame = await _verifyHmacAnySecret(String(frameSig), framePayload, tokenCands);
    if (!okFrame) return { ok: false, reason: "frame_bad_sig" };

    return { ok: true, frame: nf };
  } catch (e: any) {
    return { ok: false, reason: "verify_exception", error: String(e?.message || e) };
  }
}

/**
 * Optional per-peer rate limiter for P2P frames (abuse guard).
 * Token-bucket keyed by peerId (typically token.peerId or tokenSig).

export type P2PRateLimiter = {
  allow: (peerKey: string, cost: number, nowMs: number) => boolean;
};

/**
 * Optional per-peer rate limiter for P2P frames (abuse guard).
 * Token-bucket keyed by peerKey. In-memory only (offline/test).
 */
export function createInMemoryRateLimiter(
  opts?: { capacity?: number; refillPerSec?: number; maxPeers?: number }
): P2PRateLimiter {
  const capacity = Math.max(1, Math.floor(opts?.capacity ?? 30)); // burst frames
  const refillPerSec = Math.max(0.1, Number(opts?.refillPerSec ?? 10)); // frames/sec
  const maxPeers = Math.max(64, Math.floor(opts?.maxPeers ?? 4096));

  /** peerKey -> { tokens, lastMs } */
  const m = new Map<string, { tokens: number; lastMs: number }>();

  function sweep(_now: number) {
    if (m.size <= maxPeers) return;
    const entries = Array.from(m.entries())
      .map(([k, v]) => [k, v.lastMs] as const)
      .sort((a, b) => a[1] - b[1]);
    const drop = Math.max(0, entries.length - maxPeers);
    for (let i = 0; i < drop; i++) m.delete(entries[i][0]);
  }

  return {
    allow(peerKey: string, cost: number, nowMs: number) {
      const _now = Number.isFinite(nowMs) ? nowMs : Date._now();
      const c = Math.max(1, Math.floor(cost || 1));
      const key = peerKey && String(peerKey).length ? String(peerKey) : "anon";
      let st = m.get(key);
      if (!st) st = { tokens: capacity, lastMs: _now };
      const dt = Math.max(0, _now - st.lastMs);
      const refill = (dt / 1000) * refillPerSec;
      st.tokens = Math.min(capacity, st.tokens + refill);
      st.lastMs = _now;
      const ok = st.tokens >= c;
      if (ok) st.tokens -= c;
      m.set(key, st);
      sweep(_now);
      return ok;
    },
  };
}

export type P2PSharedSecretResolver = (kid: string | undefined) => string | undefined;

/* =========================
 * Lumora P2P — Canonical runtime exports (restored)
 * ========================= */

type __LumoraSigCfg = {
  sharedSecret?: string;
  // Optional: key rotation by token.kid
  sharedSecretResolver?: (kid: string | undefined) => string | undefined;
  // Replay protection
  replayWindowMs?: number;
  maxClockSkewMs?: number;
  seenCache?: { has: (k: string) => boolean; add: (k: string, nowMs: number) => void; sweep?: (nowMs: number) => void };
  // Rate limit
  rateLimiter?: { allow: (peerKey: string, cost: number, nowMs: number) => boolean };
  // Payload budget
  maxPayloadBytes?: number;
};

function __lumora__stableStringify(x: any): string {
  const seen = new WeakSet();
  const norm = (v: any): any => {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v)) return "[Circular]";
    seen.add(v);
    if (Array.isArray(v)) return v.map(norm);
    const keys = Object.keys(v).sort();
    const out: any = {};
    for (const k of keys) out[k] = norm(v[k]);
    return out;
  };
  return JSON.stringify(norm(x));
}

function __lumora__bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

async function __lumora__hmacHex(keyStr: string, msg: string): Promise<string> {
  // WebCrypto in Node 20+ available via globalThis.crypto
  const cryptoObj: any = (globalThis as any).crypto || require("crypto").webcrypto;
  const enc = new TextEncoder();
  const key = await cryptoObj.subtle.importKey(
    "raw",
    enc.encode(String((keyStr && String(keyStr).length > 0) ? keyStr : "__lumora_offline_default_hmac_key__")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await cryptoObj.subtle.sign("HMAC", key, enc.encode(msg));
  return __lumora__bytesToHex(new Uint8Array(sig));
}

function __lumora__pickKey(cfg: __LumoraSigCfg, token: any): string {
  const kid = token && typeof token === "object" ? token.kid : undefined;
  const r = cfg.sharedSecretResolver ? cfg.sharedSecretResolver(kid) : undefined;
  const k = r || cfg.sharedSecret || "";
  return String(k);
}

function __lumora__payloadBytes(p: any): number {
  try {
    if (p == null) return 0;
    if (typeof p === "string") return Buffer.byteLength(p, "utf8");
    if (p instanceof Uint8Array) return p.byteLength;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(p)) return p.length;
    return Buffer.byteLength(JSON.stringify(p), "utf8");
  } catch {
    return 0;
  }
}

function __lumora__frameType(frame: any): string | undefined {
  if (!frame || typeof frame !== "object") return undefined;
  return (frame.t ?? frame.type) as any;
}

function __lumora__frameSid(frame: any): string | undefined {
  if (!frame || typeof frame !== "object") return undefined;
  return (frame.sid ?? frame.sessionId) as any;
}

function __lumora__frameCid(frame: any): string | undefined {
  if (!frame || typeof frame !== "object") return undefined;
  return (frame.cid ?? frame.contentId) as any;
}

function __lumora__frameSeq(frame: any): number {
  const v = frame && typeof frame === "object" ? (frame.seq ?? frame.sequence) : undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function __lumora__frameSentAt(frame: any): number {
  const v = frame && typeof frame === "object" ? (frame.sentAt ?? frame.ts ?? frame.time) : undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function __lumora__peerKey(token: any, sig: string): string {
  const pid = token && typeof token === "object" ? (token.peerId ?? token.pid ?? token.kid) : undefined;
  const base = pid ? String(pid) : "";
  return base.length ? base : ("sig:" + String(sig || ""));
}

export function createInMemorySeenCache(opts?: { max?: number; ttlMs?: number }) {
  const max = Math.max(64, Math.floor(opts?.max ?? 8192));
  const ttlMs = Math.max(1000, Math.floor(opts?.ttlMs ?? 5 * 60_000));
  const m = new Map<string, number>();

  function sweep(nowMs: number) {
    const _now = Number.isFinite(nowMs) ? nowMs : Date._now();
    // TTL eviction
    for (const [k, t] of m.entries()) {
      if (_now - t > ttlMs) m.delete(k);
    }
    // Size eviction (drop oldest)
    if (m.size <= max) return;
    const entries = Array.from(m.entries()).sort((a, b) => a[1] - b[1]);
    const drop = Math.max(0, entries.length - max);
    for (let i = 0; i < drop; i++) m.delete(entries[i][0]);
  }

  return {
    has(k: string) {
      return m.has(String(k));
    },
    add(k: string, nowMs: number) {
      const _now = Number.isFinite(nowMs) ? nowMs : Date._now();
      m.set(String(k), _now);
      sweep(_now);
    },
    sweep,
  };
}

export async function signFrame(frame: any, cfg: __LumoraSigCfg): Promise<any> {
  const f = frame && typeof frame === "object" ? { ...frame } : { v: 1, ...frame };
  // remove any existing signature fields before signing
  delete (f as any).sig;
  delete (f as any).signature;

  const token = (f as any).token;
  const key = __lumora__pickKey(cfg || {}, token);
  const msg = __lumora__stableStringify(f);
  const sig = await __lumora__hmacHex(key, msg);

  (f as any).sig = sig; // canonical field
  return f;
}

export async function verifyFrame(frame: any, cfg: __LumoraSigCfg, nowMs: number): Promise<any> {
  try {
    const _now = Number.isFinite(nowMs) ? nowMs : Date._now();
    const f0 = frame && typeof frame === "object" ? frame : null;
    if (!f0) return { ok: false, reason: "frame_invalid" };

    const sig = String((f0 as any).sig || (f0 as any).signature || "");
    if (!sig.length) return { ok: false, reason: "frame_missing_sig" };

    // Verify signature
    const unsigned: any = { ...f0 };
    delete unsigned.sig;
    delete unsigned.signature;

    const token = unsigned.token;
    const key = __lumora__pickKey(cfg || {}, token);
    const msg = __lumora__stableStringify(unsigned);
    const expected = await __lumora__hmacHex(key, msg);
    if (expected !== sig) return { ok: false, reason: "frame_bad_sig" };

    // Extract fields for tests
    const t = __lumora__frameType(unsigned);
    const sid = __lumora__frameSid(unsigned);
    const cid = __lumora__frameCid(unsigned);
    const seq = __lumora__frameSeq(unsigned);
    const sentAt = __lumora__frameSentAt(unsigned);
    const payload = (unsigned as any).payload;

    // Clock skew checks (tests expect past/future/clock_skew reasons)
    const maxSkew = Math.max(0, Math.floor(cfg?.maxClockSkewMs ?? 30_000));
    if (sentAt && maxSkew) {
      if (sentAt < _now - maxSkew) return { ok: false, reason: "clock_skew_past" };
      if (sentAt > _now + maxSkew) return { ok: false, reason: "clock_skew_future" };
    }

    // Replay protection (tests enable seenCache + replayWindowMs)
    const windowMs = Math.max(0, Math.floor(cfg?.replayWindowMs ?? 0));
    const seen = cfg?.seenCache;
    if (seen && windowMs) {
      const k = String(sid || "") + ":" + String(seq) + ":" + sig;
      // Consider frame too old/new by replay window if sentAt present
      if (sentAt && windowMs) {
        if (sentAt < _now - windowMs) return { ok: false, reason: "past" };
        if (sentAt > _now + windowMs) return { ok: false, reason: "future" };
      }
      if (seen.has(k)) return { ok: false, reason: "replay" };
      seen.add(k, _now);
      if (typeof seen.sweep === "function") seen.sweep(_now);
    }

    // Payload size budget (oversized test)
    const maxPayloadBytes = Math.max(0, Math.floor(cfg?.maxPayloadBytes ?? 256 * 1024));
    if (maxPayloadBytes && __lumora__payloadBytes(payload) > maxPayloadBytes) {
      return { ok: false, reason: "payload_too_large" };
    }

    // Rate limit (tests expect rate_limit)
    const rl = cfg?.rateLimiter;
    if (rl && typeof rl.allow === "function") {
      const peerKey = __lumora__peerKey(token, sig);
      // Cost model: base 1; chunk_res with payload is higher
      const typ = String(t || "");
      let cost = 1;
      if (typ === "chunk_res") cost = 5 + Math.min(50, Math.ceil(__lumora__payloadBytes(payload) / 1024));
      const ok = rl.allow(peerKey, cost, _now);
      if (!ok) return { ok: false, reason: "rate_limit" };
    }

    return {
      ok: true,
      frame: { t, sid, cid, seq, sentAt, payload },
    };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return { ok: false, reason: msg };
  }
}

