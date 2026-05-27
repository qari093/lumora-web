export function logStage(stage:string, data:any){
  return {
    stage,
    size: Array.isArray(data) ? data.length : 0,
    ts: Date.now()
  };
}
