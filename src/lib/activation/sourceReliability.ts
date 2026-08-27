export function applySourceReliability(items:any[]){
  const trust: Record<string, number> = {
    google_trends: 1.2,
    reddit: 1.0,
    rss: 0.95
  };

  return items.map(x=>({
    ...x,
    final_score: (x.final_score || 1) * (trust[x.source] || 1)
  }));
}
