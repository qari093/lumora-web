export function personalize(items:any[], profile:any){
  return items.map(x=>{
    const boost = profile.boost[x.source] || 1;
    return {
      ...x,
      final_score: (x.final_score || x.score_hint || 1) * boost
    };
  });
}
