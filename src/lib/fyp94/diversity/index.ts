export function enforceFyp94Diversity(items: any[]) {
  const maxPerQuery = 4;
  const maxPerSource = 6;

  const queryCount: Record<string, number> = {};
  const sourceCount: Record<string, number> = {};

  const out: any[] = [];

  for (const item of items) {
    const q = item.query || "unknown";
    const s = item.source || "unknown";

    if ((queryCount[q] || 0) >= maxPerQuery) continue;
    if ((sourceCount[s] || 0) >= maxPerSource) continue;

    queryCount[q] = (queryCount[q] || 0) + 1;
    sourceCount[s] = (sourceCount[s] || 0) + 1;

    out.push(item);
  }

  return out;
}

export function injectFyp94Wildcard(items: any[], pool: any[]) {
  if (!pool.length) return items;

  const random = pool[Math.floor(Math.random() * pool.length)];
  const index = Math.floor(Math.random() * items.length);

  const copy = [...items];
  copy.splice(index, 0, random);

  return copy;
}
