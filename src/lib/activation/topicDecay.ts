export function applyTopicDecay(items:any[]){
  const seen:any = {};

  return items.map(x=>{
    const t = x.topic || "general";
    seen[t] = (seen[t] || 0) + 1;

    const decay = 1 / (1 + (seen[t]-1)*0.2);

    return {
      ...x,
      final_score:(x.final_score||1) * decay
    };
  });
}
