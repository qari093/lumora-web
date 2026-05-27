const health:any = {};

export function updateHealth(source:string, ok:boolean){
  if(!health[source]) health[source] = { ok:0, fail:0 };
  ok ? health[source].ok++ : health[source].fail++;
}

export function getHealth(source:string){
  return health[source] || { ok:0, fail:0 };
}
