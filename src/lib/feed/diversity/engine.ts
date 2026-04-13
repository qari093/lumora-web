export function enforceDiversity(items:any[]){
  return items.sort(()=>Math.random()-0.5);
}
