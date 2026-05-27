export function applyEngagementVelocity(items:any[]){
  return items.map(x=>{
    const clicks = x.clicks || 0;
    const dwell = x.dwell || 0;

    const signal = (clicks * 0.6) + (dwell * 0.4);

    if(signal > 50){
      return {...x, final_score:(x.final_score||1)*1.25};
    }

    if(signal > 20){
      return {...x, final_score:(x.final_score||1)*1.1};
    }

    return x;
  });
}
