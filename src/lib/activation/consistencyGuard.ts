export function applyConsistencyGuard(items:any[]){
  return items.map(x=>{
    const base = x.base_score || x.final_score || 1;
    const current = x.final_score || 1;

    if(current > base * 5){
      return {...x, final_score: base * 5};
    }

    return x;
  });
}
