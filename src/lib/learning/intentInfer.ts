export function inferIntent(signals:any){
  const total = Object.values(signals || {}).reduce<number>((a, b) => a + Number(b || 0), 0);
  if(total > 20) return "high_intent";
  if(total > 5) return "medium_intent";
  return "low_intent";
}
