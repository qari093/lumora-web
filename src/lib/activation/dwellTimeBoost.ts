export function applyDwellTimeBoost(items:any[]){
  return items.map(x=>{
    if(x.dwell){
      return {...x, final_score:(x.final_score||1)*(1 + Math.min(x.dwell/10,0.5))};
    }
    return x;
  });
}
