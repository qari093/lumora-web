export function invalidatePipeline(key:string, cache:any, ttl:any){
  if(cache?.delete) cache.delete(key);
  if(ttl?.delete) ttl.delete(key);
}
