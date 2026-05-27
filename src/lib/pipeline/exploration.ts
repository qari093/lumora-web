export function applyExploration(items:any[], ratio:number=0.2){
  return (items || []).map((x:any, i:number) => {
    const boost = (i % Math.max(1, Math.floor(1 / ratio)) === 0) ? 0.5 : 0;
    return { ...x, final_score: Number(x.final_score || 0) + boost };
  });
}
