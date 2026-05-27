const ttlMap = new Map<string, number>();

export function setTTL(key:string, ttl:number){
  ttlMap.set(key, Date.now() + ttl);
}

export function isExpired(key:string){
  const exp = ttlMap.get(key);
  return !exp || Date.now() > exp;
}
