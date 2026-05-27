export function logMetric(type:string, value:number){
  return {
    type,
    value,
    ts: Date.now()
  };
}
