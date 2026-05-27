export function applyFreshness(items:any[]){
  const now = Date.now();

  return items.map(x=>{
    const ageSec = (now - (x.ts || now)) / 1000;

    // exponential decay (stable + safe)
    const decay = Math.exp(-ageSec / 3600);

    return {
      ...x,
      final_score: Number(x.final_score || x.score_hint || 1) * decay
    };
  });
}
