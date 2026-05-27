const registry:Record<string,string> = {
  tech: "technology",
  ai: "technology",
  sport: "sports"
};

export function normalizeTopic(t:string){
  return registry[t] || t;
}
