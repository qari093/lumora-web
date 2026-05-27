export function calibrateScores(items:any[]){
  const max = Math.max(...items.map(x=>x.final_score||0),1);
  return items.map(x=>{
    const s = (x.final_score||0) / max;
    return {...x, final_score:s * 100};
  });
}
