export function balanceSources(items:any[]){
  const buckets:any = {};

  for(const x of items){
    if(!buckets[x.source]) buckets[x.source] = [];
    buckets[x.source].push(x);
  }

  const out:any[] = [];
  const sources = Object.keys(buckets);

  let i = 0;
  while(true){
    let added = false;
    for(const s of sources){
      if(buckets[s][i]){
        out.push(buckets[s][i]);
        added = true;
      }
    }
    if(!added) break;
    i++;
  }

  return out;
}
