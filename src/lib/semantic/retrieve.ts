import { findNearest } from "./search";
import type { VectorItem } from "./schema";

export function retrieveSimilar(id:string, vectors:VectorItem[], target:number[]){
  return findNearest(target, vectors, 10);
}
