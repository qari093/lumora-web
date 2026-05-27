export function summarize(metrics:any){
  const keys = Object.keys(metrics||{});
  return {
    total_keys: keys.length,
    ts: Date.now()
  };
}
