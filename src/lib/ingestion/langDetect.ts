export function detectLang(x:any){
  const text = (x.title || "").toLowerCase();
  if(/[a-z]/.test(text)) return "en";
  return "unknown";
}
export function tagLanguage(items:any[]){
  return items.map(x => ({
    ...x,
    lang: detectLang(x)
  }));
}
