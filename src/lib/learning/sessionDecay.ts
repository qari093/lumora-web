export function applySessionDecay(interests:any){
  const out:any = {};
  for(const k in interests){
    out[k] = interests[k] * 0.9; // decay 10%
  }
  return out;
}
