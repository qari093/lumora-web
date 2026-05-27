import { similarity } from "./similarity";

export function clusterItems(items:any[]){
  const clusters:any[] = [];

  for(const item of items){
    let placed = false;

    for(const c of clusters){
      if(similarity(item.vector || {}, c.vector || {}) > 0.5){
        c.items.push(item);
        placed = true;
        break;
      }
    }

    if(!placed){
      clusters.push({ vector: item.vector || {}, items:[item] });
    }
  }

  return clusters;
}
