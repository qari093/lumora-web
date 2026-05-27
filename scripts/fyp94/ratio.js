export function enforceRatio(items, maxPerQuery) {
  const count = {};
  return items.filter(item => {
    const q = item.query;
    count[q] = (count[q] || 0) + 1;
    return count[q] <= maxPerQuery;
  });
}
