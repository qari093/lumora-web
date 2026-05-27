export function applyScoreFloor(items:any[]){
  return items.map(x=>({
    ...x,
    final_score: Math.max(x.final_score || 0, 1)
  }));
}
