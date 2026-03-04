export type EngagementSnapshot = {
  xpBalance?: number | null;
  harmonyLevel?: number | null;
  squadScore?: number | null;
};

export type RankInput = {
  baseScore: number;              // from content signals (views/likes/recency)
  isMissionLane?: boolean;        // lane label
  engagement?: EngagementSnapshot;// user engagement snapshot
};

export type RankOutput = {
  score: number;
  boostApplied: number;
};

/**
 * Engagement-weighted boost (safe caps):
 * - Boost can never exceed +8% of baseScore (prevents inflation)
 * - XP contributes at most +4%
 * - Harmony contributes at most +3%
 * - Squad contributes at most +1%
 */
export function applyEngagementBoost(input: RankInput): RankOutput {
  const base = Number.isFinite(input.baseScore) ? input.baseScore : 0;
  const xp = Math.max(0, Math.min(1_000_000, input.engagement?.xpBalance ?? 0));
  const harmony = Math.max(0, Math.min(10_000, input.engagement?.harmonyLevel ?? 0));
  const squad = Math.max(0, Math.min(1_000_000, input.engagement?.squadScore ?? 0));

  // Smooth-ish curves (log) to avoid linear scaling
  const xpN = Math.log10(1 + xp) / 6;         // 0..~1
  const hN  = Math.log10(1 + harmony) / 4;    // 0..~1
  const sN  = Math.log10(1 + squad) / 6;      // 0..~1

  const xpBoost = clamp01(xpN) * 0.04;
  const hBoost  = clamp01(hN)  * 0.03;
  const sBoost  = clamp01(sN)  * 0.01;

  // Mission lane gets a tiny discovery nudge but still under global cap
  const missionNudge = input.isMissionLane ? 0.01 : 0;

  const pct = Math.min(0.08, xpBoost + hBoost + sBoost + missionNudge);
  const boostApplied = base * pct;
  return { score: base + boostApplied, boostApplied };
}

function clamp01(x: number) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}
