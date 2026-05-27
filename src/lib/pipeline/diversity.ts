export function applyDiversity(items:any[]){
  const seen = new Set<string>();
  const out:any[] = [];

  for(const x of items || []){
    const key = String(x.topic || x.media_type || "general");
    if(!seen.has(key)){
      seen.add(key);
      out.push(x);
    }
  }

  const rest = (items || []).filter((x:any) => !out.includes(x));
  return [...out, ...rest];
}
