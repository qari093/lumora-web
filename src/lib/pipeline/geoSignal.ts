export function applyGeoSignal(items:any[], geo:string="global"){
  return (items || []).map((x:any) => ({
    ...x,
    geo_score: x.geo === geo ? 1 : 0
  }));
}
