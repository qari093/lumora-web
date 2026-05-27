export function applyContextAdjust(items:any[], ctx:any){
  return items.map((x:any) => {
    let boost = 0;
    if (ctx.hour >= 18 && x.topic === "youtube") boost += 1;
    if (ctx.device === "web" && x.media_type === "embed") boost += 0.5;
    return { ...x, final_score: (x.final_score || 0) + boost };
  });
}
