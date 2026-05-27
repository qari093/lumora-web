export function baselinePredict(vec:number[]){
  return (vec||[]).reduce((a,b)=>a + Number(b||0), 0);
}
