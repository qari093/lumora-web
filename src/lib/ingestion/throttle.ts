let lastRun = 0;

export function canIngest(minIntervalMs:number=1000){
  const now = Date.now();
  if(now - lastRun < minIntervalMs) return false;
  lastRun = now;
  return true;
}
