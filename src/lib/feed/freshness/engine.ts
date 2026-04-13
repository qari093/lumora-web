export function applyFreshness(items:any[]){
  return items.map(i=>({...i,fresh:true}));
}
