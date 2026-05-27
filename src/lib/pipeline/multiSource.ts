export function mergeSources(...sources:any[]){
  return sources.flat().filter(Boolean);
}
