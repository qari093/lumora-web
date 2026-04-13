export function sessionMemory(items:any[]){
  return items.map(i=>({...i,seen:false}));
}
