export function drift(prev:number[], curr:number[]){
  const n = Math.min(prev.length, curr.length);
  if(!n) return 0;
  let d = 0;
  for(let i=0;i<n;i++){
    d += Math.abs((prev[i]||0)-(curr[i]||0));
  }
  return d / n;
}
