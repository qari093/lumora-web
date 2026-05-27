export function amplifyFeedback(interests:any){
  const out:any = {};
  for(const k in interests){
    out[k] = interests[k] * 1.2;
  }
  return out;
}
