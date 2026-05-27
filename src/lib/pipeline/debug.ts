export function debugSnapshot(items:any[]){
  return {
    sample: (items || []).slice(0,3),
    ts: Date.now()
  };
}
