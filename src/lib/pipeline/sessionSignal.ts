export function applySessionSignals(items:any[], session:any){
  return (items || []).map(x => ({
    ...x,
    session_score: Number(session?.score || 0)
  }));
}
