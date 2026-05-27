export function inferSimpleEmotion(clip) {
  const q = String(clip.query || "").toLowerCase();

  if (q.includes("laugh") || q.includes("funny") || q.includes("kids")) return "joy";
  if (q.includes("crowd") || q.includes("festival") || q.includes("concert")) return "chaos";
  if (q.includes("sports") || q.includes("football") || q.includes("basketball")) return "energy";
  if (q.includes("rain") || q.includes("ocean") || q.includes("nature")) return "calm";
  if (q.includes("city") || q.includes("street")) return "focus";

  return "surprise";
}

export function balanceEnergyLevels(clips) {
  const buckets = new Map();

  for (const clip of clips) {
    const emotion = inferSimpleEmotion(clip);
    const bucket = buckets.get(emotion) || [];
    bucket.push({ ...clip, emotion });
    buckets.set(emotion, bucket);
  }

  const out = [];
  let active = true;

  while (active) {
    active = false;
    for (const bucket of buckets.values()) {
      const next = bucket.shift();
      if (next) {
        out.push(next);
        active = true;
      }
    }
  }

  return out;
}

export function avoidRepetitiveVisualThemes(clips, maxThemeStreak = 2) {
  const out = [];
  let lastTheme = "";
  let streak = 0;

  for (const clip of clips) {
    const theme = clip.category || inferSimpleEmotion(clip);

    if (theme === lastTheme) streak += 1;
    else streak = 1;

    if (streak <= maxThemeStreak) {
      out.push(clip);
      lastTheme = theme;
      continue;
    }

    const swap = clips.find(candidate => {
      const candidateTheme = candidate.category || inferSimpleEmotion(candidate);
      return candidateTheme !== theme && !out.some(x => x.id === candidate.id);
    });

    if (swap) {
      out.push(swap);
      lastTheme = swap.category || inferSimpleEmotion(swap);
      streak = 1;
    }
  }

  return out.length ? out : clips;
}

export function ensureContinuousNoveltyPerception(clips) {
  return avoidRepetitiveVisualThemes(balanceEnergyLevels(clips), 2).map((clip, index) => ({
    ...clip,
    noveltySlot: index % 4 === 0 ? "shift" : "flow",
  }));
}
