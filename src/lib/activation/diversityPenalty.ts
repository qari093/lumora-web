export function applyDiversityPenalty(items:any[]){
  const seen:any = {};
  return items.map(x=>{
    const key = x.source;
    seen[key] = (seen[key] || 0) + 1;
    const penalty = 1 / seen[key];
    return {
      ...x,
      final_score: (x.final_score || 1) * penalty
    };
  });
}
