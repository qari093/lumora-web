export function extractKeywords(text:string){
  if(!text) return [];
  return text.toLowerCase().split(/\W+/).filter(w => w.length > 3).slice(0,5);
}
