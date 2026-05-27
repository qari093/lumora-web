export function logIngestion(event:any){
  return {
    ...event,
    ts: Date.now()
  };
}
