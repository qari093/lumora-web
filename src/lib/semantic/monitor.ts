export function logEmbeddingStats(count:number){
  return {
    embeddings: count,
    ts: Date.now()
  };
}
