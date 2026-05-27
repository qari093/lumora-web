export function deduplicate(items:any[]){
  const seen = new Set<string>();
  const out:any[] = [];

  for(const x of items){
    const key = x?.id || x?.url || JSON.stringify(x);
    if(!seen.has(key)){
      seen.add(key);
      out.push(x);
    }
  }

  return out;
}
