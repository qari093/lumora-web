export function assignCategory(x:any){
  const t = (x.title || "").toLowerCase();
  if(t.includes("news")) return "news";
  if(t.includes("game")) return "gaming";
  if(t.includes("movie")) return "entertainment";
  return "general";
}
export function applyCategory(items:any[]){
  return items.map(x => ({
    ...x,
    category: assignCategory(x)
  }));
}
