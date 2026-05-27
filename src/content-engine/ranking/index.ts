export type SignalStats = {
  impressions: number;
  holds: number;
  rewatches: number;
  skips: number;
  avgWatchMs: number;
  durationMs: number;
  uploadedAt: number;
};

export type RankedItem = {
  contentId: string;
  heatScore: number;
  tension: number;
};

export function computeHeatScore(s: SignalStats) {
  const holdRate = safeDiv(s.holds, s.impressions);
  const rewatchRate = safeDiv(s.rewatches, s.impressions);
  const completion = safeDiv(s.avgWatchMs, s.durationMs);
  const skipRate = safeDiv(s.skips, s.impressions);

  const ageHours = (Date.now() - s.uploadedAt) / 3600000;
  const decay = ageHours > 24 ? (ageHours - 24) * 0.01 : 0;

  const score =
    holdRate * 0.5 +
    rewatchRate * 0.3 +
    completion * 0.2 -
    skipRate * 0.5 -
    decay;

  return clamp(score);
}

export function applyTensionWave(items: RankedItem[], lastTension: number) {
  return items.map((item) => {
    const adjust = lastTension > 0.6 ? -0.1 : 0.1;
    return {
      ...item,
      tension: clamp(item.heatScore + adjust),
    };
  });
}

export function rankContent(input: {
  stats: Record<string, SignalStats>;
  lastTension: number;
}) {
  const items: RankedItem[] = Object.entries(input.stats).map(
    ([contentId, stats]) => ({
      contentId,
      heatScore: computeHeatScore(stats),
      tension: 0,
    }),
  );

  const waved = applyTensionWave(items, input.lastTension);

  return waved.sort((a, b) => b.tension - a.tension);
}

function safeDiv(a: number, b: number) {
  return b === 0 ? 0 : a / b;
}

function clamp(v: number) {
  return Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
}
