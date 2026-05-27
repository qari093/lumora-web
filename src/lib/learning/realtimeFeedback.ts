export function applyRealtimeFeedback(items:any[], events:any[]){
  const boostMap:any = {};
  for(const e of events || []){
    if(!e || !e.type) continue;
    if(!boostMap[e.type]) boostMap[e.type]=0;
    boostMap[e.type]+=1;
  }

  return items.map(x=>{
    const boost = boostMap[x.topic] || 0;
    return {...x, final_score:(x.final_score||0)+(boost*0.5)};
  });
}
