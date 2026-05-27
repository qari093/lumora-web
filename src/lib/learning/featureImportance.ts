export function featureImportance(weights:number[], names:string[]){
  const out = [];
  const n = Math.min(weights.length, names.length);
  for(let i=0;i<n;i++){
    out.push({
      feature: names[i],
      weight: weights[i]
    });
  }
  return out.sort((a,b)=>Math.abs(b.weight)-Math.abs(a.weight));
}
