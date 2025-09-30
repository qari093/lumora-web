const store = new Map<string, { total: number; value: number }>();

export function addGift(roomSlug: string, value: number) {
  const cur = store.get(roomSlug) || { total: 0, value: 0 };
  const next = { total: cur.total + 1, value: cur.value + value };
  store.set(roomSlug, next);
  return next;
}

export function getLedger(roomSlug: string) {
  return store.get(roomSlug) || { total: 0, value: 0 };
}
