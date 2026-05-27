const cache = new Map<string, number[]>();

export function getEmbedding(key:string){
  return cache.get(key);
}

export function setEmbedding(key:string, vec:number[]){
  cache.set(key, vec);
  return vec;
}
