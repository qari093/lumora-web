import { dot } from "./similarity";

function magnitude(v:number[]){
  return Math.sqrt(v.reduce((a,x)=>a + x*x, 0));
}

export function cosineSimilarity(a:number[], b:number[]){
  const denom = magnitude(a) * magnitude(b);
  if (!denom) return 0;
  return dot(a,b) / denom;
}
