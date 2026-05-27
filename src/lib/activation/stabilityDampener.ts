export function applyStabilityDampener(items:any[]){
  return items.map(x=>{
    const prev = x.prev_score || x.final_score || 1;

    const diff = Math.abs((x.final_score||1) - prev);

    if(diff > prev){
      return {...x, final_score: prev + (diff * 0.5)};
    }

    return x;
  });
}
