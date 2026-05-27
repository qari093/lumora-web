export function applySessionRecency(items:any[],userLastActive:number){
  const now = Date.now();
  const delta = (now - userLastActive) / 1000;

  return items.map(x=>{
    if(delta < 300){ // active within 5 min
      return {...x, final_score:(x.final_score||1)*1.1};
    }
    return x;
  });
}
