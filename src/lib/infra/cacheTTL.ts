const ttl = new Map<string, number>();

export function setTTL(k:string,ms:number){ ttl.set(k, Date.now()+ms); }
export function isExpired(k:string){
  const t = ttl.get(k);
  return !t || Date.now() > t;
}
