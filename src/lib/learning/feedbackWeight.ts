export function optimizeWeights(interests:any){
  const out:any = {};
  for(const k in interests){
    out[k] = interests[k] / (1 + Math.abs(interests[k]));
  }
  return out;
}
