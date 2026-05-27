export function applyCategorySignal(items:any[], preferred:string[]=[]){
  const set = new Set(preferred || []);
  return (items || []).map((x:any) => ({
    ...x,
    category_score: set.has(x.category) ? 1 : 0
  }));
}
