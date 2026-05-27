export function stabilizeRanks(items:any[]){
  return (items || []).map((x:any, i:number) => ({
    ...x,
    stable_rank: i + 1
  }));
}
