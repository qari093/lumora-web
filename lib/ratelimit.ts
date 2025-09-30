// Simple per-IP token bucket. Uses Redis if REDIS_URL & not NO_DOCKER, else in-memory Map.
import Redis from "ioredis";

const NO_DOCKER = process.env.LUMORA_NO_DOCKER === "1";
const WINDOW = 60; // seconds
const MAX = 120;

let redis: Redis | null = null;
if (!NO_DOCKER && process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
}

const mem = new Map<string, { count:number; exp:number }>();

export async function check(ip:string){
  const now = Math.floor(Date.now()/1000);
  if (redis) {
    const key = `rl:${ip}`;
    const res = await (redis as any).multi().incr(key).expire(key, WINDOW).exec();
    const count = Number(res?.[0]?.[1] || 0);
    return count <= MAX;
  } else {
    const rec = mem.get(ip) || { count:0, exp: now + WINDOW };
    if (now > rec.exp) { rec.count = 0; rec.exp = now + WINDOW; }
    rec.count += 1; mem.set(ip, rec);
    return rec.count <= MAX;
  }
}
