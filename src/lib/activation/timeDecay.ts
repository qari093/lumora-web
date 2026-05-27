export function applyTimeDecay(items:any[]){
  const now = Date.now();

  return items.map(x=>{
    const age = (now - (x.ts || now)) / 1000;
    const decay = 1 / (1 + age / 7200); // smoother than exp

    return {
      ...x,
      final_score:(x.final_score||1) * decay
    };
  });
}
