export function trainOffline(dataset:any[]){
  const n = (dataset||[]).length;
  const avg = n ? dataset.reduce((a,x)=>a + Number(x.y||0),0)/n : 0;
  return { model:"baseline_v1", samples:n, avg_target:avg };
}
