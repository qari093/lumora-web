import crypto from "crypto";
import { headers } from "next/headers";
import { getOrSetUid } from "./uid";

const secret = (process.env.ENERGY_SECRET || "devsecret123").toString();

// simple in-memory single-node replay map + token bucket per user+type
const seenJti = new Set<string>();
type Bucket = { tokens:number; last:number; ratePerSec:number; burst:number };
const buckets = new Map<string, Bucket>();

function bKey(uid:string, type:string){ return uid+"::"+type; }

function refill(b:Bucket){
  const now = Date.now()/1000;
  const dt = Math.max(0, now - b.last);
  b.tokens = Math.min(b.burst, b.tokens + dt * b.ratePerSec);
  b.last = now;
}

export function limit(uid:string, type:"WATCH"|"LIKE"|"COMMENT"|"SHARE"){
  // Caps (tune later): WATCH 40/min, LIKE 30/min, COMMENT 30/min, SHARE 10/min
  const cfg = type==="WATCH" ? { ratePerSec:40/60, burst:40 }
            : type==="SHARE" ? { ratePerSec:10/60, burst:10 }
            : { ratePerSec:30/60, burst:30 };
  const key = bKey(uid, type);
  let b = buckets.get(key);
  if(!b){ b = { tokens: cfg.burst, last: Date.now()/1000, ...cfg }; buckets.set(key, b); }
  refill(b);
  if(b.tokens >= 1){ b.tokens -= 1; return true; }
  return false;
}

export function issueToken(uid:string){
  const ts = Date.now();
  const jti = crypto.randomUUID();
  const payload = `${uid}.${ts}.${jti}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyToken(token:string, maxAgeMs=60_000){
  const parts = token.split(".");
  if(parts.length !== 4) return { ok:false, error:"bad_format" } as const;
  const [uid, tsStr, jti, sig] = parts;
  const ts = Number(tsStr);
  if(!uid || !Number.isFinite(ts) || !jti || !sig) return { ok:false, error:"bad_token" } as const;
  if(Date.now() - ts > maxAgeMs) return { ok:false, error:"expired" } as const;

  const payload = `${uid}.${ts}.${jti}`;
  const expSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if(!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expSig))) return { ok:false, error:"bad_sig" } as const;

  if(seenJti.has(jti)) return { ok:false, error:"replay" } as const;
  seenJti.add(jti);
  setTimeout(()=>seenJti.delete(jti), Math.ceil(maxAgeMs/2)); // auto-expire
  return { ok:true, uid } as const;
}

export function bearerUid(){
  const h = headers();
  const auth = h.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if(!token) return { ok:false as const, error:"missing_bearer" };
  return verifyToken(token);
}

export function currentUid(){ return getOrSetUid(); }
