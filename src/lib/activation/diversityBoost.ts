export function applyDiversityBoost(items:any[]){
  const seen:any = {};

  return items.map(x=>{
    const key = x.topic || "general";
    seen[key] = (seen[key] || 0) + 1;

    const boost = 1 / seen[key]; // early items boosted, later reduced

    return {
      ...x,
      final_score:(x.final_score||1) * boost
    };
  });
}
