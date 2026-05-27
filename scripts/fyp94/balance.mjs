export const MAX_PER_QUERY = 5;

export function enforcePerQueryCap(items, maxPerQuery = MAX_PER_QUERY) {
  const counts = new Map();

  return items.filter((item) => {
    const query = item.query || "unknown";
    const next = (counts.get(query) || 0) + 1;
    counts.set(query, next);
    return next <= maxPerQuery;
  });
}

export function validateCategorySpread(items, maxGap = 5) {
  const counts = new Map();

  for (const item of items) {
    const query = item.query || "unknown";
    counts.set(query, (counts.get(query) || 0) + 1);
  }

  const values = [...counts.values()];
  if (!values.length) return false;

  return Math.max(...values) - Math.min(...values) <= maxGap;
}
