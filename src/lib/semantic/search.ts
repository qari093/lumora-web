import type { VectorItem } from "./schema";
import { cosineSimilarity } from "./cosine";

export function findNearest(target:number[], items:VectorItem[], limit:number=5){
  return [...items]
    .map(item => ({
      ...item,
      similarity: cosineSimilarity(target, item.vector),
    }))
    .sort((a,b) => b.similarity - a.similarity)
    .slice(0, limit);
}
