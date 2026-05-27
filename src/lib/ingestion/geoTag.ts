export function inferGeo(x:any){
  return {
    ...x,
    geo: x.geo || "global"
  };
}
export function applyGeo(items:any[]){
  return items.map(inferGeo);
}
