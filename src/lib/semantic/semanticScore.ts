import { findNearest } from "./search";
import type { VectorItem } from "./schema";

export function applySemanticScore(items:any[], target:number[], vectors:VectorItem[]){
  const nearest = findNearest(target, vectors, items.length);
  const map:any = {};
  nearest.forEach(n => map[n.id] = n.similarity || 0);

  return items.map(x => ({
    ...x,
    final_score: (x.final_score || 0) + (map[x.id] || 0)
  }));
}
