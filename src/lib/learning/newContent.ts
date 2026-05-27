export function boostNewContent(items:any[]){
  const now = Date.now();
  return (items || []).map(x=>{
    const age = now - (x.ts || now);
    const boost = age < 600000 ? 2 : 0; // <10 min
    return {...x, final_score:(x.final_score || 0) + boost};
  });
}
