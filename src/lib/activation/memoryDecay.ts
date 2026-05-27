export function applyMemoryDecay(items:any[]){
  return items.map(x=>{
    if(x.last_seen){
      const age = (Date.now()-x.last_seen)/1000;
      const decay = Math.exp(-age/7200);
      return {...x, final_score:(x.final_score||1)*decay};
    }
    return x;
  });
}
