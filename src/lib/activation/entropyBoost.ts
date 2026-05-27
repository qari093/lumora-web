export function applyEntropyBoost(items:any[]){
  const sources = items.map(x=>x.source);
  const unique = new Set(sources).size;
  const entropyFactor = unique / Math.max(1, items.length);

  return items.map(x=>{
    return {
      ...x,
      final_score:(x.final_score||1)*(1 + entropyFactor)
    };
  });
}
