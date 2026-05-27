export function applyFreshnessFloor(items:any[]){
  const now = Date.now();

  return items.map(x=>{
    const age = (now - (x.ts || now)) / 1000;

    if(age > 86400){ // older than 1 day
      return {...x, final_score:(x.final_score||1)*0.7};
    }

    return x;
  });
}
