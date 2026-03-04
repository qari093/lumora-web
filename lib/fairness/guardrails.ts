export type ViewerTier = "free" | "plus" | "pro" | "admin";

export type FairnessDecision = {
  ok: boolean;
  allowedMaxHeight: number;
  allowedMaxWidth: number;
  reason?: "tier_cap" | "invalid_dims";
};

const clampInt = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.trunc(n)));

const isFinitePos = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n > 0;

/**
 * enforceResolutionCap
 * - Free tier hard-cap at 720p (height <= 720).
 * - Plus/Pro allow higher, but keep sane maxima to avoid abuse.
 * - Returns normalized allowed dimensions (does not up-scale; only caps).
 */
export function enforceResolutionCap(args: {
  tier: ViewerTier;
  width: number;
  height: number;
}): FairnessDecision {
  const { tier } = args;
  const w = args.width;
  const h = args.height;

  if (!isFinitePos(w) || !isFinitePos(h)) {
    return { ok: false, allowedMaxHeight: 720, allowedMaxWidth: 1280, reason: "invalid_dims" };
  }

  // Hard ceilings by tier (conservative, bandwidth-safe)
  const capByTier: Record<ViewerTier, { maxH: number; maxW: number }> = {
    free: { maxH: 720, maxW: 1280 },
    plus: { maxH: 1080, maxW: 1920 },
    pro: { maxH: 2160, maxW: 3840 },
    admin: { maxH: 4320, maxW: 7680 },
  };

  const cap = capByTier[tier] ?? capByTier.free;

  // If input exceeds cap, mark not-ok, but still return cap values.
  const exceeds = h > cap.maxH || w > cap.maxW;

  return {
    ok: !exceeds,
    allowedMaxHeight: cap.maxH,
    allowedMaxWidth: cap.maxW,
    reason: exceeds ? "tier_cap" : undefined,
  };
}

/**
 * applyFairnessToScore
 * - Ensures engagement boosts (already capped separately) never override fairness.
 * - If fairness says content is tier-capped, reduce score slightly to prevent
 *   disproportionate distribution pressure from high-cost variants.
 */
export function applyFairnessToScore(args: {
  score: number;
  fairness: FairnessDecision;
}): number {
  const s = args.score;
  if (!Number.isFinite(s)) return 0;
  if (args.fairness.reason !== "tier_cap") return s;

  // Small dampening only; keep ranking stable while honoring cost fairness.
  // Bound the dampening to avoid large swings.
  const damp = 0.03; // 3%
  return s * (1 - damp);
}

/**
 * normalizeRequestedVariant
 * - Takes a requested (w,h) and returns a capped variant (no upscaling).
 */
export function normalizeRequestedVariant(args: {
  tier: ViewerTier;
  width: number;
  height: number;
}): { width: number; height: number; capped: boolean } {
  const decision = enforceResolutionCap(args);
  if (!decision.ok && decision.reason === "tier_cap") {
    const nw = clampInt(Math.min(args.width, decision.allowedMaxWidth), 1, decision.allowedMaxWidth);
    const nh = clampInt(Math.min(args.height, decision.allowedMaxHeight), 1, decision.allowedMaxHeight);
    return { width: nw, height: nh, capped: true };
  }
  return { width: args.width, height: args.height, capped: false };
}
