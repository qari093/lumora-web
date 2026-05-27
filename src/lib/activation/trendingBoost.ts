export function applyTrendingBoost(items:any[]){
  return items.map(x=>{
    if(x.source === "google_trends"){
      return {...x, final_score: (x.final_score||1) * 1.3};
    }
    return x;
  });
}
