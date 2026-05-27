let count = 0;

export function incIngested(n:number=1){
  count += n;
}

export function getMetrics(){
  return { ingested: count };
}
