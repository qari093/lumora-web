export function applySourceDecay(items:any[]){
  const penalty: Record<string, number> = {
    rss: 0.9,
    google_trends: 1.0,
    reddit: 1.1
  };

  return items.map(x=>({
    ...x,
    final_score: (x.final_score || x.score_hint || 1) * (penalty[x.source] || 1)
  }));
}
