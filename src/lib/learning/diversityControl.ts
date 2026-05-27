export function diversityVsRelevance(items:any[], diversityWeight:number=1){
  return items.map((x:any, i:number) => ({
    ...x,
    final_score: (x.final_score || 0) - (i * 0.05 * diversityWeight)
  }));
}
