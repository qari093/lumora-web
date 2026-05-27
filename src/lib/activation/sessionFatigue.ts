export function applySessionFatigue(items:any[],sessionCount:number){
  return items.map(x=>{
    if(sessionCount > 20){
      return {...x, final_score:(x.final_score||1)*0.85};
    }
    return x;
  });
}
