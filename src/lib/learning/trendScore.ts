export function trendVelocity(cluster:any){
  const size = cluster.items?.length || 0;
  return size * 1.5;
}
