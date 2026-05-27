const hits:any = {};

export function allow(key:string, limit:number=10){
  const now = Date.now();
  hits[key] = hits[key] || [];
  hits[key] = hits[key].filter((t:number)=> now - t < 60000);
  if(hits[key].length >= limit) return false;
  hits[key].push(now);
  return true;
}
