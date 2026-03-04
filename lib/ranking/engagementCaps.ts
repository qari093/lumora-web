export type EngagementBoost = {
  xpDelta?: number;        // raw XP delta; may be negative
  missionBoost?: number;   // 0..1 recommended
  squadBoost?: number;     // 0..1 recommended
  harmonyBoost?: number;   // 0..1 recommended
};

/**
 * scoreWithEngagementCaps
 * - Never lets engagement weighting exceed +8% of base score (inflation cap)
 * - Handles non-finite baseScore safely (returns 0)
 * - Allows negative effects down to -8% (symmetry; keeps bounded)
 */
export function scoreWithEngagementCaps(baseScore: number, engagement?: EngagementBoost): number {
  if (!Number.isFinite(baseScore)) return 0;

  const e = engagement ?? {};
  const xp = Number.isFinite(e.xpDelta as number) ? Number(e.xpDelta) : 0;

  // Normalize XP into a tiny signal (saturating). Keep this cheap and bounded.
  // Scale chosen to be stable across small test values; saturation prevents runaway.
  const xpSignal = Math.tanh(xp / 250); // [-1,1]

  const mission = Number.isFinite(e.missionBoost as number) ? Number(e.missionBoost) : 0;
  const squad = Number.isFinite(e.squadBoost as number) ? Number(e.squadBoost) : 0;
  const harmony = Number.isFinite(e.harmonyBoost as number) ? Number(e.harmonyBoost) : 0;

  // Weighted engagement signal (bounded). Clamp each component lightly.
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const signal =
    0.25 * xpSignal +
    0.30 * clamp01(mission) +
    0.25 * clamp01(squad) +
    0.20 * clamp01(harmony);

  // Convert to bounded multiplier with hard caps (±8%).
  const maxDelta = 0.08;
  const delta = Math.max(-maxDelta, Math.min(maxDelta, signal * maxDelta));

  return baseScore * (1 + delta);
}
