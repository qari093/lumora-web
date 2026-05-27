export function applyRepeatDecay(items:any[]){
  return items.map(x=>{
    const seen = x.impressions || 0;

    if(seen > 5){
      return {...x, final_score:(x.final_score||1)*0.7};
    }

    if(seen > 2){
      return {...x, final_score:(x.final_score||1)*0.85};
    }

    return x;
  });
}
