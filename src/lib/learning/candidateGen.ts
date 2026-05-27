export function generateCandidates(items:any[], limit:number=50){
  return (items || [])
    .sort((a:any,b:any)=>(b.pre_score || 0) - (a.pre_score || 0))
    .slice(0, limit);
}
