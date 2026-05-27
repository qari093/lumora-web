export function applyRelevanceGuard(items:any[]){
  return items.filter(x=>{
    const title = (x.title || "").toLowerCase().trim();
    if(!title) return false;
    if(title.length < 4) return false;
    if(title === "unknown") return false;
    return true;
  });
}
