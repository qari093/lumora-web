export function applyAnomalyGuard(items:any[]){
  return (items || []).map(x => {
    let s = Number(x.final_score||0);
    if(s > 100) s = 100;
    if(s < 0) s = 0;
    return { ...x, final_score: s };
  });
}
