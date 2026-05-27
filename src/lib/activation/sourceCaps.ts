export function applySourceCaps(items:any[]){
  const limits:any = {
    reddit: 8,
    google_trends: 8,
    rss: 8
  };

  const count:any = {};
  const out:any[] = [];

  for(const x of items){
    const s = x.source;
    count[s] = (count[s] || 0);

    if(count[s] < (limits[s] || 8)){
      out.push(x);
      count[s]++;
    }
  }

  return out;
}
