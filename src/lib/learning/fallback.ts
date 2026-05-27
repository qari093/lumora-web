export function fallbackRanking(items:any[]){
  return (items || []).sort((a:any,b:any)=>(b.score||0)-(a.score||0));
}
