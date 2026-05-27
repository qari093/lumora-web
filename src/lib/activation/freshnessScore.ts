export function applyFreshness(items:any[]){
  const now = Date.now();

  return items.map(x=>{
    const age = (now - x.ts) / 1000;
    const decay = Math.exp(-age / 3600); // 1h decay
    return {
      ...x,
      final_score: (x.score_hint || 1) * decay
    };
  });
}
