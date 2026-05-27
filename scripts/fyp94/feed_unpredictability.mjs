export function limitCategoryStreak(items, maxStreak = 2) {
  const out = [];
  let lastCategory = "";
  let streak = 0;

  for (const item of items) {
    const cat = item.category || "unknown";

    if (cat === lastCategory) streak++;
    else streak = 1;

    if (streak <= maxStreak) {
      out.push(item);
      lastCategory = cat;
      continue;
    }

    const swap = items.find(x => {
      const candidateCategory = x.category || "unknown";
      return candidateCategory !== cat && !out.some(y => y.id === x.id);
    });

    if (swap) {
      out.push(swap);
      lastCategory = swap.category || "unknown";
      streak = 1;
    }
  }

  return out.length ? out : items;
}

export function injectDifferentCategoryAfterStreak(items, maxStreak = 2) {
  return limitCategoryStreak(items, maxStreak);
}

export function maintainFeedUnpredictability(items) {
  const mixed = limitCategoryStreak(items, 2);

  return mixed.map((item, index) => ({
    ...item,
    unpredictabilitySlot: index % 5 === 0 ? "shift" : "flow",
  }));
}

export function buildUnpredictableFeed(items) {
  return maintainFeedUnpredictability(
    injectDifferentCategoryAfterStreak(items, 2)
  );
}
