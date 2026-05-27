export function applyUserAffinity(items:any[],profile:any={}){
  return items.map(x=>{
    const topic = x.topic || "general";
    const weight = profile[topic] || 1;

    return {
      ...x,
      final_score:(x.final_score||1) * (1 + weight*0.1)
    };
  });
}
