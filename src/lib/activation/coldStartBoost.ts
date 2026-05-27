export function applyColdStartBoost(items:any[]){
  return items.map(x=>{
    const age = (Date.now() - (x.ts || Date.now())) / 1000;

    if(age < 600 && !(x.clicks || x.impressions)){
      return {...x, final_score:(x.final_score||1)*1.2};
    }

    return x;
  });
}
