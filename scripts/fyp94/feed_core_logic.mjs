export function createSessionSeed(now = Date.now()) {
  return Number(now) + Math.floor(Math.random() * 1_000_000);
}

export function stableShuffle(items, seed = createSessionSeed()) {
  const out = [...items];

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.abs((seed + i * 9301 + 49297) % (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

export function filterRecentlySeen(items, seenIds = [], fallbackMin = 10) {
  const seen = new Set(seenIds);
  const fresh = items.filter(x => !seen.has(x.id));

  return fresh.length >= fallbackMin ? fresh : items;
}

export function enforceNoSameItemRepetition(items) {
  const out = [];
  let lastId = null;

  for (const item of items) {
    if (item.id === lastId) continue;
    out.push(item);
    lastId = item.id;
  }

  return out;
}

export function buildCoreFeed(items, seenIds = [], seed = createSessionSeed()) {
  return enforceNoSameItemRepetition(
    stableShuffle(
      filterRecentlySeen(items, seenIds),
      seed
    )
  );
}
