const cache = new Map<string, any>();

export function setCache(k:string,v:any){ cache.set(k,v); }
export function getCache(k:string){ return cache.get(k); }
export function clearCache(k:string){ cache.delete(k); }
