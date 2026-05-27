export function applyAnomalyGuard(items:any[]){
  return items.map(x=>{
    let score = Number(x.final_score||0);
    if(score > 100) score = 100;
    if(score < 0) score = 0;
    return {...x, final_score:score};
  });
}
