const logs:any[] = [];

export function audit(entry:any){
  logs.push({ ...entry, ts: Date.now() });
}

export function getAudit(){
  return logs;
}
