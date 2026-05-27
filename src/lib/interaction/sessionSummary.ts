export function summarize(events){
  const out = {like:0,share:0,save:0,skip:0,watch:0};
  for(const e of events){
    if(out[e.type] !== undefined) out[e.type]++;
  }
  return out;
}
