export function applySemanticScore(items:any[]){
  return (items || []).map(x => ({
    ...x,
    semantic_score: Number(x.semantic_score || 0)
  }));
}
