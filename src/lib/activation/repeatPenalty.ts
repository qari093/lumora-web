export function applyRepeatPenalty(items:any[], prev:any[]){
  const seen = new Set(prev.map(x=>x.id));

  return items.map(x=>{
    if(seen.has(x.id)){
      return {...x, final_score: (x.final_score||1) * 0.5};
    }
    return x;
  });
}
