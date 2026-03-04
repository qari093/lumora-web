export type Tier = "free" | "pro" | "admin";

export type Resolution = Readonly<{
  width: number;
  height: number;
}>;

export type FairnessDecision = Readonly<{
  ok: boolean;
  effective: Resolution;   // post-clamp
  reason?: string;
}>;

export const FREE_MAX_HEIGHT = 720;
export const FREE_MAX_WIDTH = 1280;

/**
 * Enforces a fairness cap: free users may not exceed 720p (height) / 1280w.
 * - If either dimension exceeds the cap, it is clamped proportionally to fit within cap.
 * - Pro/admin: no clamping.
 */
export function enforceResolutionCap(input: Readonly<{ tier: Tier; requested: Resolution }>): FairnessDecision {
  const { tier, requested } = input;
  const w = Math.max(1, Math.floor(requested.width));
  const h = Math.max(1, Math.floor(requested.height));

  if (tier !== "free") return { ok: true, effective: { width: w, height: h } };

  // Already compliant
  if (w <= FREE_MAX_WIDTH && h <= FREE_MAX_HEIGHT) {
    return { ok: true, effective: { width: w, height: h } };
  }

  // Clamp while preserving aspect ratio as much as possible
  const scaleW = FREE_MAX_WIDTH / w;
  const scaleH = FREE_MAX_HEIGHT / h;
  const scale = Math.min(scaleW, scaleH);

  const cw = Math.max(1, Math.floor(w * scale));
  const ch = Math.max(1, Math.floor(h * scale));

  return {
    ok: true,
    effective: { width: cw, height: ch },
    reason: "free_tier_clamped_to_720p",
  };
}
