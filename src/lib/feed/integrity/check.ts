export function integrityCheck(feed:any[]){
  return feed.every(f => f !== null);
}
