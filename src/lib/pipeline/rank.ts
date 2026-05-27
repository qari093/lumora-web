export function rankItems(items:any[]){
  return (items || [])
    .sort((a,b) => Number(b.final_score||0) - Number(a.final_score||0))
    .map((x,i) => ({ ...x, rank: i + 1 }));
}
