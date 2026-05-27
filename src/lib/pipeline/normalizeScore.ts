export function normalizeScores(items:any[]){
  const max = Math.max(1, ...(items || []).map((x:any)=>Number(x.final_score||0)));
  return (items || []).map((x:any) => ({
    ...x,
    final_score: (Number(x.final_score||0) / max) * 100
  }));
}
