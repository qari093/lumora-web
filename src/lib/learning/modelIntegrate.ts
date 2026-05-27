export function mergeModelScore(items:any[]){
  return (items||[]).map(x => ({
    ...x,
    final_score: Number(x.final_score||0) + Number(x.model_score||0)
  }));
}
