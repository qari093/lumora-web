export type Track = { id:string; title:string; artist:string; genre:string; energy:'calm'|'focus'|'hype'; bpm:number; url:string };
export async function fetchTracks(params?: { q?:string; energy?:string; genre?:string; limit?:number }): Promise<Track[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.energy) qs.set('energy', params.energy);
  if (params?.genre) qs.set('genre', params.genre);
  if (params?.limit) qs.set('limit', String(params.limit));
  const res = await fetch(`/api/music/manifest?${qs.toString()}`, { cache: 'no-store' });
  const json = await res.json();
  return json.items as Track[];
}
export function autoPlaylist(all: Track[], intent: 'focus'|'calm'|'hype', targetBpm?: number) {
  const pool = all.filter(t => t.energy === intent);
  if (!targetBpm) return pool.slice(0, 200);
  return pool.map(t => ({ t, d: Math.abs((t.bpm||0) - targetBpm) }))
             .sort((a,b)=>a.d-b.d)
             .slice(0, 200)
             .map(x => x.t);
}
