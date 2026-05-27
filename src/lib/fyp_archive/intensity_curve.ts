export function computeIntensity(item: any): number {
  const base =
    Number(item.viralScore || 0) * 0.45 +
    Number(item.humanScore || 0) * 0.35 +
    Number(item.eventDensity || 0) * 0.2;

  return Math.min(Math.max(base, 0), 1);
}

export function classifyIntensity(item: any): "low" | "medium" | "spike" {
  const score = computeIntensity(item);
  if (score >= 0.7) return "spike";
  if (score >= 0.35) return "medium";
  return "low";
}

export function insertIntensitySpikes(feed: any[], interval = 4) {
  const spikes = feed.filter((item) => classifyIntensity(item) === "spike");
  const rest = feed.filter((item) => classifyIntensity(item) !== "spike");
  const out: any[] = [];

  for (let i = 0; i < rest.length; i++) {
    out.push({ ...rest[i], intensity: classifyIntensity(rest[i]) });

    if ((i + 1) % interval === 0 && spikes.length) {
      out.push({ ...spikes.shift(), intensity: "spike", spikeSlot: true });
    }
  }

  return [...out, ...spikes.map((item) => ({ ...item, intensity: "spike" }))];
}

export function preventFlatIntensitySequences(feed: any[], maxFlat = 3) {
  const out: any[] = [];
  let last = "";
  let streak = 0;

  for (const item of feed) {
    const intensity = item.intensity || classifyIntensity(item);

    if (intensity === last) streak++;
    else streak = 1;

    if (streak <= maxFlat) {
      out.push({ ...item, intensity });
      last = intensity;
    }
  }

  return out;
}

export function resetAfterSpike(feed: any[]) {
  return feed.map((item, index) => {
    const prev = feed[index - 1];
    if (prev?.intensity === "spike" && item.intensity !== "low") {
      return { ...item, postSpikeReset: true };
    }
    return item;
  });
}

export function buildIntensityCurve(feed: any[]) {
  return resetAfterSpike(
    preventFlatIntensitySequences(
      insertIntensitySpikes(feed, 4),
      3,
    ),
  );
}
