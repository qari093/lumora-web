export function tracePipeline(id:string){
  return {
    trace_id: id,
    ts: Date.now()
  };
}
