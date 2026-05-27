const cache = new Map<string, any>();

export function getFeedCache(key:string){
  return cache.get(key) || null;
}

export function setFeedCache(key:string, value:any){
  cache.set(key, value);
  return value;
}
