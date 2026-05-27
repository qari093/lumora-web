export function applyExploration(items:any[], enabled:boolean=true){
  if(!enabled) return items;
  return items.map((x:any, i:number) => ({
    ...x,
    final_score: (x.final_score || 0) + (i % 4 === 0 ? 1 : 0)
  }));
}
