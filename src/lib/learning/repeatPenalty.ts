export function applyRepeatPenalty(items:any[]){
  const seen:any = {};
  return items.map(x=>{
    if(!seen[x.topic]) seen[x.topic]=0;
    seen[x.topic]++;
    const penalty = seen[x.topic] > 2 ? seen[x.topic]*0.5 : 0;
    return {...x, final_score:(x.final_score||0)-penalty};
  });
}
