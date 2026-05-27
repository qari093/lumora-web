const hits = new Map<string, { count:number; ts:number }>();

export function allowSource(source:string, limit:number=10){
  const now = Date.now();
  const state = hits.get(source) || { count:0, ts:now };

  if(now - state.ts > 60000){
    hits.set(source, { count:1, ts:now });
    return true;
  }

  if(state.count >= limit) return false;

  state.count += 1;
  hits.set(source, state);
  return true;
}
