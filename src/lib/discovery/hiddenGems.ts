export type HiddenGemArgs = {
  views: number;            // total views (impressions/view starts)
  likes?: number;
  reactions?: number;       // lightweight engagement signal
  comments?: number;
  shares?: number;
  ageHours?: number;        // content age in hours
};

export type HiddenGemDecision = {
  isHiddenGem: boolean;
  ratio: number;            // engagement ratio
  reason?: "high_ratio_low_views" | "too_old" | "insufficient_ratio" | "invalid";
};

/**
 * computeEngagementRatio
 * - Weighted but conservative (no inflation).
 * - Uses per-view engagement, bounded to avoid div-by-zero and spam.
 */
export function computeEngagementRatio(a: HiddenGemArgs): number {
  const v = a.views;
  if (!Number.isFinite(v) || v <= 0) return 0;

  const likes = a.likes ?? 0;
  const reacts = a.reactions ?? 0;
  const comments = a.comments ?? 0;
  const shares = a.shares ?? 0;

  const raw = (likes * 1 + reacts * 0.6 + comments * 1.2 + shares * 1.6) / v;

  if (!Number.isFinite(raw) || raw < 0) return 0;

  // Clamp to prevent gaming (ratio in [0, 0.5] ~ extremely high)
  return Math.min(raw, 0.5);
}

/**
 * isHiddenGem
 * - Identify content with unusually good engagement ratio but low distribution.
 * - ageHours guard to avoid resurrecting stale content aggressively.
 */
export function isHiddenGem(a: HiddenGemArgs): HiddenGemDecision {
  const v = a.views;
  if (!Number.isFinite(v) || v < 0) return { isHiddenGem: false, ratio: 0, reason: "invalid" };

  const age = a.ageHours ?? 0;
  if (Number.isFinite(age) && age > 168) { // 7 days
    return { isHiddenGem: false, ratio: computeEngagementRatio(a), reason: "too_old" };
  }

  const ratio = computeEngagementRatio(a);

  // Low-views window (kept small to avoid reranking everything)
  const lowViews = v > 0 && v <= 250;

  // Threshold tuned for "hidden gem": strong engagement per view
  const threshold = 0.06; // 6% weighted engagement per view

  if (lowViews && ratio >= threshold) {
    return { isHiddenGem: true, ratio, reason: "high_ratio_low_views" };
  }

  return { isHiddenGem: false, ratio, reason: "insufficient_ratio" };
}

/**
 * missionDiscoveryHook
 * - Lean hook: if content is a hidden gem, emit a deterministic "mission hint"
 *   used by mission templates (no DB writes here).
 */
export function missionDiscoveryHook(a: HiddenGemArgs): { hint: "DISCOVER_HIDDEN_GEM" | null; ratio: number } {
  const d = isHiddenGem(a);
  return { hint: d.isHiddenGem ? "DISCOVER_HIDDEN_GEM" : null, ratio: d.ratio };
}
