const blocked = new Set<string>();

export function blockSource(source:string){
  blocked.add(source);
}

export function isBlocked(source:string){
  return blocked.has(source);
}
