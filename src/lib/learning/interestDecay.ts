export function decayInterests(interests:any, factor:number=0.95){
  const out:any = {};
  for(const k in interests){
    out[k] = interests[k] * factor;
  }
  return out;
}
