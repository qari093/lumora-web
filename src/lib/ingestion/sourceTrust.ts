const TRUST:any = {
  rss: 1,
  reddit: 0.8,
  youtube: 0.9,
  crawler: 0.7
};
export function applySourceTrust(items:any[]){
  return items.map(x => ({
    ...x,
    trust_score: TRUST[x.source] ?? 0.5
  }));
}
