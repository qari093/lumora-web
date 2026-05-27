export function applyTrendMomentum(items:any[]){
  return items.map(x=>{
    const velocity = x.velocity || 0;

    if(velocity > 100){
      return {...x, final_score:(x.final_score||1)*1.3};
    }

    if(velocity > 50){
      return {...x, final_score:(x.final_score||1)*1.15};
    }

    return x;
  });
}
