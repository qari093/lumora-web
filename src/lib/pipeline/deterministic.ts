export function enforceDeterminism(items:any[]){
  return (items || []).map((x:any, i:number) => ({
    ...x,
    deterministic_id: `${x.id || "item"}_${i}`
  }));
}
