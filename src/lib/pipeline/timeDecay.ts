export function applyTimeDecay(items:any[]){
  const now = Date.now();
  return (items || []).map((x:any) => {
    const age = now - Number(x.ts || now);
    const decay = age > 3600000 ? -1 : 0;
    return { ...x, final_score: Number(x.final_score || 0) + decay };
  });
}
