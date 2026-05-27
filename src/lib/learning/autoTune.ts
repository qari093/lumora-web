export function autoTune(params:any, drift:number){
  const factor = drift > 10 ? 1.1 : 1.0;
  const out:any = {};

  for(const k in params){
    out[k] = params[k] * factor;
  }

  return out;
}
