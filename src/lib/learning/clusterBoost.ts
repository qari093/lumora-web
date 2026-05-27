export function applyClusterBoost(items:any[], cluster:string){
  return items.map((x:any) => {
    let boost = 0;
    if (cluster === "engaged" && x.media_type === "youtube") boost = 1;
    if (cluster === "avoidant" && x.media_type === "embed") boost = 0.5;
    return { ...x, final_score: (x.final_score || 0) + boost };
  });
}
