import { loadVectors, saveVectors } from "./persist";

export function refreshIndex(){
  const vectors = loadVectors();
  saveVectors(vectors);
  return vectors.length;
}
