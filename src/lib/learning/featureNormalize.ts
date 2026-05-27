export function normalizeVector(vec:number[]){
  const max = Math.max(...vec.map(v=>Math.abs(v)),1);
  return vec.map(v=>v/max);
}
