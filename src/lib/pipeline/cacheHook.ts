const cache = new Map<string, any>();

export function setPipelineCache(key:string, value:any){
  cache.set(key, value);
}

export function getPipelineCache(key:string){
  return cache.get(key);
}
