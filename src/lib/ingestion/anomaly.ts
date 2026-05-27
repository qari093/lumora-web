export function detectIngestionAnomaly(metrics:{avg:number; max:number; count:number}){
  if((metrics.max || 0) > (metrics.avg || 0) * 3 && (metrics.count || 0) > 5){
    return true;
  }
  return false;
}
