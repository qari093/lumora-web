export function applyExplorationBoost(items:any[]){
  return items.map((x,i)=>{
    if(i > 20 && i < 60){ // mid-feed exploration zone
      return {...x, final_score:(x.final_score||1)*1.15};
    }
    return x;
  });
}
