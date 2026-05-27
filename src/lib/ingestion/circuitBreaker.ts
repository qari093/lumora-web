const failMap:any = {};

export function recordFail(src:string){
  failMap[src] = (failMap[src] || 0) + 1;
}

export function resetFail(src:string){
  failMap[src] = 0;
}

export function isBlocked(src:string){
  return (failMap[src] || 0) >= 5;
}
