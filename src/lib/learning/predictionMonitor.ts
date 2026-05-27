const logs:any[] = [];

export function logPrediction(x:any){
  logs.push({ ...x, ts: Date.now() });
}

export function getLogs(){
  return logs;
}
