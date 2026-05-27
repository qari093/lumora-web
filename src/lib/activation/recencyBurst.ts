export function applyRecencyBurst(items:any[]){
  const now = Date.now();

  return items.map(x=>{
    const age = (now - (x.ts || now)) / 1000;

    if(age < 300){ // last 5 minutes
      return {...x, final_score: (x.final_score||1) * 1.5};
    }

    return x;
  });
}
