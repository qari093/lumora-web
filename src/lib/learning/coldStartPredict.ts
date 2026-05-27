export function coldStartPredict(items:any[]){
  return (items || []).map((x:any, i:number) => ({
    ...x,
    cold_start_score: Number(x.final_score || 0) + Math.max(0, 5 - i)
  }));
}
