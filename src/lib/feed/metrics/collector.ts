export function collectMetrics(feed:any[]){
  return { count: feed.length, ts: Date.now() };
}
