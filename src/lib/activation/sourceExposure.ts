export function applySourceExposure(items:any[]){
  const total = items.length;
  const counts:any = {};

  return items.map(x=>{
    const s = x.source;
    counts[s] = (counts[s] || 0) + 1;

    const ratio = counts[s] / total;

    // reduce dominance
    const modifier = ratio > 0.4 ? 0.7 : 1;

    return {
      ...x,
      final_score: (x.final_score || 1) * modifier
    };
  });
}
