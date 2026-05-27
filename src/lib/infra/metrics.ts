const metrics:any = {};

export function inc(name:string){
  metrics[name] = (metrics[name]||0)+1;
}

export function getMetrics(){
  return metrics;
}
