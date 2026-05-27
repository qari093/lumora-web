export function behaviorSequence(events:any[]){
  return (events || []).map(e => e.type);
}
