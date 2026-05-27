export function applyFreshness(items:any[]){
  const now = Date.now();
  return items.map((x:any)=>{
    const ts = x.ts || now;
    const age = now - ts;
    const boost = age < 3600000 ? 1 : 0;
    return {...x, final_score:(x.final_score||0)+boost};
  });
}
