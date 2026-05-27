import type { VectorItem } from "./schema";

const vectorStore = new Map<string, VectorItem>();

export function putVector(item: VectorItem){
  vectorStore.set(item.id, item);
  return item;
}

export function getVector(id: string){
  return vectorStore.get(id) || null;
}

export function listVectors(){
  return Array.from(vectorStore.values());
}
