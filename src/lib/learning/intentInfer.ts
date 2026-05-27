export function inferIntent(signals:any){
  const total = Object.values(signals||{}).reduce((a:any,b:any)=>a+b,0);
  if(total > 20) return "high_intent";
  if(total > 5) return "medium_intent";
  return "low_intent";
}
