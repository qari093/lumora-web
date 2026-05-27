export function applyOutlierClamp(items:any[]){
  const scores = items.map(x=>x.final_score||1);
  const avg = scores.reduce((a,b)=>a+b,0)/scores.length;

  return items.map(x=>{
    const cap = avg * 3;
    const val = Math.min(x.final_score||1, cap);
    return {...x, final_score: val};
  });
}
