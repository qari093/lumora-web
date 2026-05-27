export function applyVelocity(items:any[]){
  const now = Date.now();

  return items.map(x=>{
    const ageSec = (now - (x.ts || now)) / 1000;

    // faster rising content = higher boost
    const velocity = 1 / Math.max(ageSec, 1);

    return {
      ...x,
      final_score: (x.final_score || 1) * (1 + velocity)
    };
  });
}
