export function dynamicAdjust(items:any[], weights:any){
  return items.map((x:any) => {
    const extra = weights[x.topic] || 0;
    return { ...x, final_score: (x.final_score || 0) + extra };
  });
}
