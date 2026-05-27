export function dedupeSignals(items:any[]){
  const seen = new Set();
  const out = [];

  for(const x of items){
    const key = x.title?.toLowerCase().slice(0,80);
    if(!key || seen.has(key)) continue;
    seen.add(key);
    out.push(x);
  }

  return out;
}
