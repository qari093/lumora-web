export function applyBoostCap(items:any[], cap:number=100){
  return (items || []).map((x:any) => {
    let s = Number(x.final_score || 0);
    if(s > cap) s = cap;
    return { ...x, final_score: s };
  });
}
