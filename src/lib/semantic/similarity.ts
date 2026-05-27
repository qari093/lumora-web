export function dot(a:number[], b:number[]){
  let out = 0;
  const n = Math.min(a.length, b.length);
  for(let i=0;i<n;i++) out += a[i] * b[i];
  return out;
}
