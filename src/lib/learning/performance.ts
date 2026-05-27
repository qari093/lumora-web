export function collectMetrics(items:any[]){
  return {
    count: items.length,
    avg_score: items.reduce((a,x)=>a+(x.final_score||0),0) / (items.length || 1),
    max_score: Math.max(...items.map(x=>x.final_score||0),0)
  };
}
