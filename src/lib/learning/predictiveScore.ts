export function predictivePreScore(items:any[], profile:any){
  const state = profile?.state || "low_engagement";
  const factor = state === "high_engagement" ? 1.2 : state === "medium_engagement" ? 1.1 : 1.0;

  return items.map((x:any) => ({
    ...x,
    pre_score: (x.final_score || x.score || 0) * factor
  }));
}
