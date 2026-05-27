export function normalizeItem(x:any){
  return {
    id: x.id || "",
    title: x.title || "",
    description: x.description || "",
    url: x.url || null,
    source: x.source || "unknown",
    topic: x.topic || "general",
    media_type: x.media_type || "embed",
    ts: x.ts || Date.now(),
    score: x.score || 0,
    final_score: x.final_score || 0
  };
}

export function normalizeBatch(items:any[]){
  return items.map(normalizeItem);
}
