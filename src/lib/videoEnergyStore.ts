type VideoStat = { energy:number; updatedAt:number };
const vids = new Map<string, VideoStat>();

export function addVideoEnergy(videoId:string, add:number){
  if(!videoId) return getVideoEnergy(videoId);
  let v = vids.get(videoId);
  if(!v){ v = { energy:0, updatedAt: Date.now() }; vids.set(videoId, v); }
  v.energy += Math.max(0, Math.round(add));
  v.updatedAt = Date.now();
  return { id: videoId, energy: v.energy, updatedAt: v.updatedAt };
}

export function getVideoEnergy(videoId:string){
  const v = vids.get(videoId) || { energy:0, updatedAt: 0 };
  return { id: videoId, energy: v.energy, updatedAt: v.updatedAt };
}
