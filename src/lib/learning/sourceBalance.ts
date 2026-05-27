export function balanceSources(items:any[]){
  const buckets: Record<string, any[]> = {};
  for (const item of items) {
    const key = item.source || "unknown";
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(item);
  }

  const sources = Object.keys(buckets);
  const out:any[] = [];

  while (sources.some((s) => buckets[s].length > 0)) {
    for (const s of sources) {
      if (buckets[s].length > 0) out.push(buckets[s].shift());
    }
  }

  return out;
}
