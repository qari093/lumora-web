export function applyRealtimeSignals(items:any[], events:any[]){
  const boostMap:any = {};
  for(const e of events || []){
    if(!e?.type) continue;
    boostMap[e.type] = (boostMap[e.type] || 0) + 1;
  }

  return (items || []).map(x => ({
    ...x,
    realtime_score: Number(boostMap[x.topic] || 0)
  }));
}
