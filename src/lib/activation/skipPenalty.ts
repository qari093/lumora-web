export function applySkipPenalty(items:any[]){
  return items.map(x=>{
    if(x.skips){
      const penalty = Math.max(0.5, 1 - x.skips*0.05);
      return {...x, final_score:(x.final_score||1)*penalty};
    }
    return x;
  });
}
