export function updateAffinity(aff:any, topic:string, delta:number){
  const out = { ...(aff||{}) };
  out[topic] = (out[topic]||0) + delta;
  return out;
}
