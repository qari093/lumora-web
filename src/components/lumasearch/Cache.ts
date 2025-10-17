export type CacheEntry<T=any> = { t: number; data: T };
const KEY = "luma_cache_v1";
const TTL_MS = 2 * 60 * 1000; // 2 minutes
const MAX = 30;

function read(): Record<string, CacheEntry> {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function write(obj: Record<string, CacheEntry>) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch {}
}

export function getCache(q: string): CacheEntry | null {
  try{
    const all = read();
    const e = all[q];
    if (!e) return null;
    if (Date.now() - e.t > TTL_MS) return null;
    return e;
  }catch{ return null; }
}

export function setCache(q: string, data: any){
  try{
    const all = read();
    all[q] = { t: Date.now(), data };
    const keys = Object.keys(all);
    if(keys.length > MAX){
      keys.sort((a,b)=> (all[a].t - all[b].t));
      for(let i=0;i<keys.length-MAX;i++) delete all[keys[i]];
    }
    write(all);
  }catch{}
}
