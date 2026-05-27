export function applyLearningScore(items:any[], interests:any){
  return items.map(x=>{
    let boost = (interests[x.topic] || 0) * 3;
    return {...x, final_score:(x.final_score||0)+boost};
  });
}
