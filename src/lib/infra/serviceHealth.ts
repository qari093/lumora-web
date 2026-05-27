export function serviceHealth(name:string, ok:boolean=true){
  return {
    service: name,
    ok,
    ts: Date.now()
  };
}
