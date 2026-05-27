export function enforceSourceCoverage(items:any[],minSources=2){
  const sources = new Set(items.map(x=>x.source));

  if(sources.size >= minSources) return items;

  return items.sort((a,b)=>{
    return (a.source > b.source) ? 1 : -1;
  });
}
