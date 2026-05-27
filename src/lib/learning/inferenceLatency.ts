const samples:number[] = [];

export function recordInferenceLatency(ms:number){
  samples.push(ms);
}

export function getInferenceLatency(){
  const count = samples.length;
  const avg = count ? samples.reduce((a,b)=>a+b,0) / count : 0;
  const max = count ? Math.max(...samples) : 0;
  return { count, avg, max };
}
