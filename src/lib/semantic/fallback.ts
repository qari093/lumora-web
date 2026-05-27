export function ensureVector(vec:any, size:number=128){
  if(Array.isArray(vec) && vec.length > 0) return vec;
  return Array(size).fill(0);
}
