export function enrichItems(items:any[]){
  return (items || []).map(x => ({
    ...x,
    enriched: true,
    ts: x.ts || Date.now()
  }));
}
