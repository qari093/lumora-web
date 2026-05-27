export function mergeBehavior(items:any[]){
  return (items || []).map(x => ({
    ...x,
    final_score: Number(x.final_score||0)
      + Number(x.session_score||0)
      + Number(x.realtime_score||0)
  }));
}
