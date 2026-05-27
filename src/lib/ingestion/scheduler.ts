export function scheduleIngestion(interval:number=60000){
  return {
    interval,
    nextRun: Date.now() + interval
  };
}
