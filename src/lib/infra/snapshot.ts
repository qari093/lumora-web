export function snapshot(state:any){
  return {
    state,
    ts: Date.now()
  };
}
