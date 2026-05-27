export function applySourceWeight(items:any[]){
  const weights:any = {
    rss: 1.0,
    reddit: 1.1,
    youtube: 1.2,
    crawler: 0.9
  };

  return (items || []).map((x:any) => ({
    ...x,
    final_score: Number(x.final_score || 0) * Number(weights[x.source] || 1)
  }));
}
