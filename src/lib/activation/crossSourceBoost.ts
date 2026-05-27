export function applyCrossSourceBoost(items:any[]){
  const seen:any = {};

  for(const x of items){
    const key = (x.title || "").toLowerCase().slice(0,50);
    if(!seen[key]) seen[key] = new Set();
    seen[key].add(x.source);
  }

  return items.map(x=>{
    const key = (x.title || "").toLowerCase().slice(0,50);
    const count = seen[key]?.size || 1;

    return {
      ...x,
      final_score: (x.final_score || 1) * (1 + (count-1)*0.2)
    };
  });
}
