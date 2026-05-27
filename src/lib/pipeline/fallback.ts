export function applyFallback(items:any[]){
  if(!items || items.length === 0){
    return [{
      id: "fallback",
      title: "No content available",
      final_score: 0
    }];
  }
  return items;
}
