export function applyTopicDiversity(items:any[]){
  const seen:any = {};

  return items.map(x=>{
    const t = x.topic || "unknown";
    seen[t] = (seen[t] || 0) + 1;

    const multiplier = 1 / seen[t];

    return {
      ...x,
      final_score: (x.final_score || x.score_hint || 1) * multiplier
    };
  });
}
