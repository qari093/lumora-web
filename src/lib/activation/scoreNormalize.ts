export function applyScoreNormalize(items:any[]){
  const scores = items.map(x=>x.final_score||1);

  const max = Math.max(...scores);
  const min = Math.min(...scores);

  if(max === min) return items;

  return items.map(x=>{
    const norm = (x.final_score - min) / (max - min);
    return {...x, final_score: norm * 100};
  });
}
