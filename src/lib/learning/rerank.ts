export function rerankCandidates(items:any[]){
  return (items || []).map((x:any, i:number) => ({
    ...x,
    rerank_score: (x.pre_score || x.final_score || 0) - (i * 0.01)
  })).sort((a:any,b:any)=>(b.rerank_score || 0) - (a.rerank_score || 0));
}
