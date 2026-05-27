export type UserAffinity = Record<string, number>;

export type AffinitySignal = {
  tags: string[];
  holdDurationMs: number;
  videoDurationMs: number;
  skipped?: boolean;
};

export type FeedCandidate = {
  contentId: string;
  tags: string[];
  durationMs: number;
  resonanceIndex: number;
};

export function updateAffinityVector(current: UserAffinity, signal: AffinitySignal): UserAffinity {
  const next = { ...current };
  const ratio = signal.videoDurationMs > 0 ? signal.holdDurationMs / signal.videoDurationMs : 0;
  const skipPenalty = signal.skipped ? 0.7 : 0;
  const weight = Math.max(0, ratio * (1 - skipPenalty));

  for (const tag of signal.tags) {
    next[tag] = Number(((next[tag] || 0) + weight).toFixed(4));
  }

  return next;
}

export function scoreAffinityMatch(candidate: FeedCandidate, affinity: UserAffinity) {
  if (!candidate.tags.length) return 0;
  const total = candidate.tags.reduce((sum, tag) => sum + (affinity[tag] || 0), 0);
  return clamp01(total / candidate.tags.length);
}

export function shouldInjectCalm(input: {
  recentSkips: number;
  recentHolds: number;
  fastScrolls: number;
}) {
  return input.recentSkips >= 3 || input.fastScrolls >= 4 || input.recentHolds === 0;
}

export function selectCalmCandidate(candidates: FeedCandidate[]) {
  return (
    [...candidates]
      .filter((c) => c.tags.includes("calm") || c.tags.includes("nature") || c.durationMs <= 20000)
      .sort((a, b) => b.resonanceIndex - a.resonanceIndex)[0] || null
  );
}

export function assembleAffinityFeed(input: {
  candidates: FeedCandidate[];
  affinity: UserAffinity;
  injectCalm: boolean;
}) {
  const scored = input.candidates
    .map((candidate) => ({
      ...candidate,
      affinityScore: scoreAffinityMatch(candidate, input.affinity),
    }))
    .sort((a, b) => b.affinityScore + b.resonanceIndex - (a.affinityScore + a.resonanceIndex));

  if (!input.injectCalm) return scored;

  const calm = selectCalmCandidate(input.candidates);
  if (!calm) return scored;

  return [calm, ...scored.filter((item) => item.contentId !== calm.contentId)];
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}
