export function normalizeItems(items:any[]){
  return (items || []).map(x => ({
    ...x,
    title: String(x.title || "").trim(),
    topic: x.topic || "general"
  }));
}
