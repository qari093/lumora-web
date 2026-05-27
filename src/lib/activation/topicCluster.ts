function normalize(text:string){
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ")
    .trim();
}

export function detectTopic(title:string){
  const t = normalize(title);
  const words = t.split(" ").filter(Boolean);

  if(words.length === 0) return "unknown";

  const strong = words.find(w => w.length >= 6);
  if(strong) return strong;

  return words[0] || "unknown";
}

export function attachTopics(items:any[]){
  return items.map(x=>({
    ...x,
    topic: detectTopic(x.title || "")
  }));
}
