import { getRedis } from "./redis";

type VideoStat = { energy:number; updatedAt:number; lastDonor?:string };

export async function addVideoEnergy(videoId:string, add:number, donor?:string){
  const r = getRedis();
  const now = Date.now();
  const inc = Math.max(0, Math.round(add));
  if(r){
    const k = `video:${videoId}:energy`;
    const val = await r.incrby(k, inc);
    await r.set(`video:${videoId}:updatedAt`, String(now), "EX", 24*3600);
    if(donor){ await r.set(`video:${videoId}:lastDonor`, donor, "EX", 300); }
    return { id: videoId, energy: Number(val), updatedAt: now, lastDonor: donor };
  }else{
    const v = memGet(videoId);
    v.energy += inc; v.updatedAt = now; if(donor) v.lastDonor = donor;
    mem.set(videoId, v);
    return { id: videoId, energy: v.energy, updatedAt: v.updatedAt, lastDonor: v.lastDonor };
  }
}

export async function getVideoEnergy(videoId:string){
  const r = getRedis();
  if(r){
    const v = Number(await r.get(`video:${videoId}:energy`) || 0);
    const ts = Number(await r.get(`video:${videoId}:updatedAt`) || 0);
    const donor = await r.get(`video:${videoId}:lastDonor`) || undefined;
    return { id: videoId, energy: v, updatedAt: ts, lastDonor: donor };
  }else{
    const s = memGet(videoId);
    return { id: videoId, energy: s.energy, updatedAt: s.updatedAt, lastDonor: s.lastDonor };
  }
}

// memory fallback
const mem = new Map<string, VideoStat>();
function memGet(id:string){ return mem.get(id) || { energy:0, updatedAt:0 }; }
