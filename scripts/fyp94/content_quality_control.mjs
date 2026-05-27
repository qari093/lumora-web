export const QUALITY_RULES = {
  minMotionScore: 0.25,
  maxPolishScore: 0.92,
  minHumanScore: 0.35,
  maxPerQuery: 8,
  maxPerSource: 60,
};

export function estimateHumanPriority(clip) {
  const q = String(clip.query || "").toLowerCase();

  const humanTerms = [
    "people",
    "kids",
    "crowd",
    "reaction",
    "arguing",
    "laughing",
    "performance",
    "celebration",
    "wedding",
    "airport",
    "street",
    "sports",
    "football",
    "basketball",
    "concert",
    "festival",
  ];

  return humanTerms.some((term) => q.includes(term)) ? 1 : Number(clip.humanScore ?? 0.4);
}

export function rejectOverPolishedClip(clip) {
  const polishScore = Number(clip.polishScore ?? 0.5);
  return polishScore <= QUALITY_RULES.maxPolishScore;
}

export function prioritizeHumanInteraction(clips) {
  return [...clips].sort((a, b) => estimateHumanPriority(b) - estimateHumanPriority(a));
}

export function enforceQueryBalance(clips, maxPerQuery = QUALITY_RULES.maxPerQuery) {
  const counts = new Map();

  return clips.filter((clip) => {
    const query = clip.query || "unknown";
    const next = (counts.get(query) || 0) + 1;
    counts.set(query, next);
    return next <= maxPerQuery;
  });
}

export function enforceSourceBalance(clips, maxPerSource = QUALITY_RULES.maxPerSource) {
  const counts = new Map();

  return clips.filter((clip) => {
    const source = clip.source || "unknown";
    const next = (counts.get(source) || 0) + 1;
    counts.set(source, next);
    return next <= maxPerSource;
  });
}

export function applyContentQualityControl(clips) {
  return enforceSourceBalance(
    enforceQueryBalance(
      prioritizeHumanInteraction(
        clips.filter(rejectOverPolishedClip),
      ),
    ),
  );
}
