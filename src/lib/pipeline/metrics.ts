export function collectMetrics(items:any[]){
  return {
    count: (items || []).length,
    avg_score: (items || []).reduce((a:any,x:any)=>a + Number(x.final_score||0),0) / Math.max(1,(items||[]).length)
  };
}
