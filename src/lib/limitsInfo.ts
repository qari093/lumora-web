import { getRedis } from "./redis";
export async function approxRemaining(uid:string, type:"WATCH"|"LIKE"|"COMMENT"|"SHARE"){
  // Mirror of 60s window: WATCH 40, LIKE/COMMENT 30, SHARE 10
  const cap = type==="WATCH" ? 40 : type==="SHARE" ? 10 : 30;
  const r = getRedis();
  if(!r) return null; // unknown on memory limiter
  const v = Number(await r.get(`bucket:${uid}:${type}`) || 0);
  return Math.max(0, cap - v);
}
