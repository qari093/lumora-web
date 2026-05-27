export function detectDrift(oldVec:number[], newVec:number[]){
  if(!oldVec || !newVec) return 0;
  let diff = 0;
  const n = Math.min(oldVec.length, newVec.length);
  for(let i=0;i<n;i++){
    diff += Math.abs(oldVec[i] - newVec[i]);
  }
  return diff / n;
}
