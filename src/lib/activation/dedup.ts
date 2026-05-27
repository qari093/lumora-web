export function applyDedup(items:any[]){
  const seen = new Set();

  return items.filter(x=>{
    const key = (x.title || "").toLowerCase().slice(0,80);
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
