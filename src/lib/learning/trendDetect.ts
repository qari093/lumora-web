export function detectTrends(clusters:any[]){
  return clusters.filter(c => (c.items?.length || 0) >= 3);
}
