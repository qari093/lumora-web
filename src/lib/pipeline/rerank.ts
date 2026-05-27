export function rerank(items:any[]){
  return (items || [])
    .sort((a:any,b:any) => Number(b.final_score || 0) - Number(a.final_score || 0))
    .map((x:any,i:number) => ({ ...x, rank: i + 1 }));
}
