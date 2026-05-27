export function applySaturationGuard(items:any[]){
  const counts:any = {};
  return (items || []).map(x=>{
    const key = x.topic || "general";
    counts[key] = (counts[key] || 0) + 1;
    const penalty = counts[key] > 3 ? counts[key] * 0.2 : 0;
    return {...x, final_score:(x.final_score || 0) - penalty};
  });
}
