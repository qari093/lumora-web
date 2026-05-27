export function segmentSession(events:any[]){
  const session:any = {
    length: events.length,
    types: {}
  };

  for(const e of events){
    if(!session.types[e.type]) session.types[e.type]=0;
    session.types[e.type]++;
  }

  return session;
}
