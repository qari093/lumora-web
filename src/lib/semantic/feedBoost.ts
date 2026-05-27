export function applySemanticBoost(items:any[]){
  return items.map(x => ({
    ...x,
    final_score: (x.final_score || 0) + (x.semantic_score || 0)
  }));
}
