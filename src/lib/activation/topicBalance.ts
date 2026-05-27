export function applyTopicBalance(items:any[]){
  const counts:any = {};

  return items.map(x=>{
    const t = x.topic || "general";
    counts[t] = (counts[t] || 0) + 1;

    const adjust = counts[t] > 3 ? 0.75 : 1;

    return {
      ...x,
      final_score:(x.final_score||1) * adjust
    };
  });
}
