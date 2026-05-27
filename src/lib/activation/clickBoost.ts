export function applyClickBoost(items:any[]){
  return items.map(x=>{
    if(x.clicks){
      return {...x, final_score: (x.final_score||1) * (1 + x.clicks * 0.01)};
    }
    return x;
  });
}
