export function aggregateSignals(events:any[]){
  const out:any = {};
  for(const e of events||[]){
    const k = e.type;
    out[k] = (out[k]||0) + 1;
  }
  return out;
}
