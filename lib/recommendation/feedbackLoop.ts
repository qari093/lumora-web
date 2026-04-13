export type FeedbackEventType = "like" | "skip" | "complete" | "watch";

export type FeedbackEvent = {
  itemId: string;
  userId: string;
  tags?: string[];
  creatorId?: string;
  type: FeedbackEventType;
  watchMs?: number;
};

export type FeedbackProfile = {
  tagAffinity: Record<string, number>;
  creatorAffinity: Record<string, number>;
};

const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

export function buildFeedbackProfile(events: FeedbackEvent[]): FeedbackProfile {
  const tagAffinity: Record<string, number> = {};
  const creatorAffinity: Record<string, number> = {};

  for (const event of events) {
    let delta = 0;

    if (event.type === "like") delta = 2;
    else if (event.type === "complete") delta = 1.5;
    else if (event.type === "watch") delta = (event.watchMs ?? 0) >= 5000 ? 1 : 0.25;
    else if (event.type === "skip") delta = -2;

    for (const tag of event.tags ?? []) {
      tagAffinity[tag] = clamp((tagAffinity[tag] ?? 0) + delta, -10, 10);
    }

    if (event.creatorId) {
      creatorAffinity[event.creatorId] = clamp(
        (creatorAffinity[event.creatorId] ?? 0) + delta,
        -10,
        10
      );
    }
  }

  return { tagAffinity, creatorAffinity };
}

export function applyFeedbackScore(
  baseScore: number,
  item: { tags?: string[]; creatorId?: string },
  profile: FeedbackProfile
): number {
  let score = baseScore;

  for (const tag of item.tags ?? []) {
    score += (profile.tagAffinity[tag] ?? 0) * 0.15;
  }

  if (item.creatorId) {
    score += (profile.creatorAffinity[item.creatorId] ?? 0) * 0.2;
  }

  return Number(score.toFixed(4));
}
