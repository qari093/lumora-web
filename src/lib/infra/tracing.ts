export function trace(id:string, step:string){
  return {
    trace_id: id,
    step,
    ts: Date.now()
  };
}
