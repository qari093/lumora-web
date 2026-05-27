const logs:any[] = [];

export function logAudit(x:any){
  logs.push({ ...x, ts: Date.now() });
}

export function getLogs(){
  return logs;
}
