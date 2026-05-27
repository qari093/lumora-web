export function detectNativeAudio(item: any): boolean {
  if (typeof item.hasAudio === "boolean") return item.hasAudio;

  const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();

  if (
    text.includes("concert") ||
    text.includes("crowd") ||
    text.includes("music") ||
    text.includes("speech") ||
    text.includes("interview")
  ) {
    return true;
  }

  return false;
}

export function prioritizeAudioClips(items: any[]) {
  return [...items].sort((a, b) => {
    const aAudio = detectNativeAudio(a) ? 1 : 0;
    const bAudio = detectNativeAudio(b) ? 1 : 0;
    return bAudio - aAudio;
  });
}

export function markSilentClips(items: any[]) {
  return items.map((item) => ({
    ...item,
    hasAudio: detectNativeAudio(item),
    silent: !detectNativeAudio(item),
  }));
}

export function preventSilentStreak(items: any[]) {
  const out: any[] = [];
  let silentCount = 0;

  for (const item of items) {
    const isSilent = !detectNativeAudio(item);

    if (isSilent) {
      silentCount++;
      if (silentCount > 2) continue;
    } else {
      silentCount = 0;
    }

    out.push(item);
  }

  return out;
}

export function buildSoundAwareFeed(items: any[]) {
  const marked = markSilentClips(items);
  const prioritized = prioritizeAudioClips(marked);
  const filtered = preventSilentStreak(prioritized);

  return {
    feed: filtered,
    hasAudioCount: filtered.filter((x) => x.hasAudio).length,
  };
}
