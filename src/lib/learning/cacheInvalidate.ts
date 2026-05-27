export function invalidateCache(cache:any, key:string){
  if(cache && cache.delete){
    cache.delete(key);
  }
}
