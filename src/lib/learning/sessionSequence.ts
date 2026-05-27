export function buildSessionSequence(events:any[]){
  return (events || [])
    .sort((a,b)=>(a.ts||0)-(b.ts||0))
    .map(e => e.type);
}
