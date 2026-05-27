export function incrementalIngest(prev:any[], next:any[]){
  const ids = new Set(prev.map(x=>x.id));
  return next.filter(x=>!ids.has(x.id));
}
