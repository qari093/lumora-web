export function semanticDedup(items:any[]){
  const seen = new Set();
  return items.filter(x=>{
    const key = JSON.stringify(x.vector?.slice(0,5));
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
