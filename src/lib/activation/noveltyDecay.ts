export function applyNoveltyDecay(items:any[]){
  return items.map(x=>{
    const seen = x.impressions || 0;

    if(seen > 10){
      return {...x, final_score:(x.final_score||1)*0.65};
    }

    if(seen > 5){
      return {...x, final_score:(x.final_score||1)*0.8};
    }

    return x;
  });
}
