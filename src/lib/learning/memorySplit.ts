export function splitMemory(events:any[]){
  const short = (events||[]).slice(-10);
  const long = (events||[]).slice(0, -10);
  return { short, long };
}
