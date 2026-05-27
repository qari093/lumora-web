export function applyDwellDecay(items:any[]){
  return items.map(x=>{
    const dwell = x.dwell || 0;

    if(dwell < 1000){
      return {...x, final_score:(x.final_score||1)*0.8};
    }

    if(dwell < 3000){
      return {...x, final_score:(x.final_score||1)*0.9};
    }

    return x;
  });
}
