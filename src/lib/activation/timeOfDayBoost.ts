export function applyTimeOfDayBoost(items:any[]){
  const hour = new Date().getHours();

  return items.map(x=>{
    if(hour >= 18 && hour <= 23 && x.source === "reddit"){
      return {...x, final_score: (x.final_score||1) * 1.2};
    }
    if(hour >= 6 && hour <= 10 && x.source === "rss"){
      return {...x, final_score: (x.final_score||1) * 1.1};
    }
    return x;
  });
}
