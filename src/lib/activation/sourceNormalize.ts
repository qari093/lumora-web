export function applySourceNormalize(items:any[]){
  const counts:any = {};

  for(const x of items){
    counts[x.source] = (counts[x.source] || 0) + 1;
  }

  return items.map(x=>{
    const total = items.length;
    const ratio = counts[x.source] / total;

    const adjust = ratio > 0.5 ? 0.8 : 1;

    return {
      ...x,
      final_score:(x.final_score||1)*adjust
    };
  });
}
