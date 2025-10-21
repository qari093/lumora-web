export type TrustVerdict =
  | { ok: true; flags: string[]; meta: any }
  | { ok: false; reason: "BLOCKED_IP" | "UA_BLOCKED" | "RATE_LIMITED"; flags: string[]; meta: any };

declare global {
  // eslint-disable-next-line no-var
  var __TRUST_BUCKETS: Map<string, { tokens: number; updatedAt: number }> | undefined;
  // eslint-disable-next-line no-var
  var __TRUST_STATS: { ipHits: Map<string, number>; uaHits: Map<string, number>; blocks: Map<string, number> } | undefined;
}
const BUCKETS: Map<string, { tokens: number; updatedAt: number }> = (globalThis.__TRUST_BUCKETS ||= new Map());
const STATS = (globalThis.__TRUST_STATS ||= { ipHits: new Map<string, number>(), uaHits: new Map<string, number>(), blocks: new Map<string, number>() });

/** Dev-config via env (comma-separated). */
function envList(name: string): string[] {
  const v = process.env[name] || "";
  return v.split(",").map(s => s.trim()).filter(Boolean);
}
const IP_DENY = new Set(envList("TRUST_IP_DENY"));
const IP_ALLOW = new Set(envList("TRUST_IP_ALLOW"));

/** Token bucket: capacity/burst and refill rate (tokens per second). */
const BURST = Number(process.env.TRUST_BURST || "10");       // burst tokens
const REFILL = Number(process.env.TRUST_REFILL || "2");      // tokens per second
const COST = 1; // one token per request

function bucketConsume(key: string, now = Date.now()) {
  const rec = BUCKETS.get(key) || { tokens: BURST, updatedAt: now };
  const elapsedSec = Math.max(0, (now - rec.updatedAt) / 1000);
  rec.tokens = Math.min(BURST, rec.tokens + elapsedSec * REFILL);
  rec.updatedAt = now;
  if (rec.tokens >= COST) {
    rec.tokens -= COST;
    BUCKETS.set(key, rec);
    return { ok: true, remaining: rec.tokens };
  }
  BUCKETS.set(key, rec);
  return { ok: false, remaining: rec.tokens };
}

const UA_BLOCK_PATTERNS = [
  /headless/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
  /curl\/|wget\/|python-requests|axios|okhttp/i,
  /node\.js|postmanruntime/i,
  /\bbot\b|\bcrawler\b|\bspider\b/i
];

const UA_ALLOW_HINTS = [
  /chrome\/|safari\/|firefox\/|edg\//i
];

export function trustCheck(ip: string, uaRaw: string): TrustVerdict {
  const ua = (uaRaw || "").slice(0, 256);
  // stats
  STATS.ipHits.set(ip, (STATS.ipHits.get(ip) || 0) + 1);
  STATS.uaHits.set(ua, (STATS.uaHits.get(ua) || 0) + 1);

  const flags: string[] = [];
  const meta: any = { burst: BURST, refill: REFILL };

  // IP allow > deny > rest
  if (IP_ALLOW.size && IP_ALLOW.has(ip)) {
    flags.push("IP_ALLOW");
    meta.bucket = { remaining: BURST, bypass: true };
    return { ok: true, flags, meta };
  }
  if (IP_DENY.size && IP_DENY.has(ip)) {
    flags.push("IP_DENY");
    bumpBlock("BLOCKED_IP");
    return { ok: false, reason: "BLOCKED_IP", flags, meta };
  }

  // UA heuristics (allow hints bypass block patterns)
  let uaBlocked = false;
  if (!UA_ALLOW_HINTS.some(rx => rx.test(ua))) {
    uaBlocked = UA_BLOCK_PATTERNS.some(rx => rx.test(ua));
  }
  if (uaBlocked) {
    flags.push("UA_SUSPECT");
    bumpBlock("UA_BLOCKED");
    return { ok: false, reason: "UA_BLOCKED", flags, meta };
  }

  // Token bucket per IP
  const tok = bucketConsume(ip);
  meta.bucket = { remaining: +tok.remaining.toFixed(2) };
  if (!tok.ok) {
    flags.push("RATE_LIMIT");
    bumpBlock("RATE_LIMITED");
    return { ok: false, reason: "RATE_LIMITED", flags, meta };
  }

  return { ok: true, flags, meta };
}

function bumpBlock(kind: "BLOCKED_IP" | "UA_BLOCKED" | "RATE_LIMITED") {
  STATS.blocks.set(kind, (STATS.blocks.get(kind) || 0) + 1);
}

export function dumpStats() {
  const ip = Array.from(STATS.ipHits.entries()).map(([k,v]) => ({ ip:k, hits:v }))
    .sort((a,b)=>b.hits-a.hits).slice(0,50);
  const ua = Array.from(STATS.uaHits.entries()).map(([k,v]) => ({ ua:k, hits:v }))
    .sort((a,b)=>b.hits-a.hits).slice(0,50);
  const blocks = Array.from(STATS.blocks.entries()).map(([k,v]) => ({ reason:k, count:v }));
  return { ip, ua, blocks, buckets: BUCKETS.size };
}
