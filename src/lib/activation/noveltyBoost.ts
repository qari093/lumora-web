export function applyNoveltyBoost(items:any[]){
  const seen = new Set();

  return items.map(x=>{
    const key = (x.title || "").toLowerCase().slice(0,50);

    if(seen.has(key)){
      return {...x, final_score: (x.final_score||1) * 0.8};
    }

    seen.add(key);
    return {...x, final_score: (x.final_score||1) * 1.1};
  });
}
