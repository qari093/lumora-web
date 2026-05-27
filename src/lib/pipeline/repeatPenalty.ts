export function applyRepeatPenalty(items:any[]){
  const seen = new Set<string>();
  return (items || []).map(x => {
    const key = String(x.id || "");
    const penalty = seen.has(key) ? -2 : 0;
    seen.add(key);
    return { ...x, final_score: Number(x.final_score||0) + penalty };
  });
}
