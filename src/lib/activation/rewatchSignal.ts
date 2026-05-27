export function applyRewatchSignal(items:any[]){
  return items.map(x=>{
    const r = x.replays || 0;

    if(r > 2){
      return {...x, final_score:(x.final_score||1)*1.2};
    }

    if(r > 0){
      return {...x, final_score:(x.final_score||1)*1.1};
    }

    return x;
  });
}
