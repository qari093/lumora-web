export function verifyRanking(items:any[]){
  return (items || []).every((x:any, i:number) => Number(x.rank) === i + 1);
}
