export function applyEngagementDecay(items:any[]){
  return items.map(x=>{
    const penalty = x.source === "rss" ? 0.95 : 1;
    return {
      ...x,
      final_score: (x.final_score || 1) * penalty
    };
  });
}
