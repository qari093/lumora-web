export function checkConsistency(items:any[]){
  return Array.isArray(items) && items.every(x => x && typeof x === "object");
}
