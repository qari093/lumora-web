export function applyModelScore(items:any[]){
  return (items || []).map(x => ({
    ...x,
    model_score: Number(x.model_score || 0)
  }));
}
