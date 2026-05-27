const ttl = new Map<string, number>();

export function setPipelineTTL(key:string, ms:number){
  ttl.set(key, Date.now() + ms);
}

export function isPipelineExpired(key:string){
  const exp = ttl.get(key);
  return !exp || Date.now() > exp;
}
