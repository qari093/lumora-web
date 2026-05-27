export function clusterVectors(items:any[]){
  const groups:any = {};
  for(const x of items){
    const key = (x.vector?.[0] || 0).toFixed(1);
    if(!groups[key]) groups[key] = [];
    groups[key].push(x);
  }
  return Object.values(groups);
}
