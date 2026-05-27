export function assignClusterIds(clusters:any[]){
  return clusters.map((c, i) => ({
    id: "cluster_" + i,
    items: c.items
  }));
}
