export function applyHybridScore(items:any[], semanticWeight:number=1, baseWeight:number=1){
  return items.map(x => ({
    ...x,
    hybrid_score: ((x.final_score || 0) * baseWeight) + ((x.semantic_score || 0) * semanticWeight)
  }));
}
