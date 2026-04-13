export type AdImpressionInput = {
  adId?: string | null;
  campaignId?: string | null;
  userId?: string | null;
  placement?: string | null;
  sessionId?: string | null;
  ts?: number | null;
};

export type AdImpressionRecord = {
  id: string;
  adId: string;
  campaignId: string;
  userId: string;
  placement: string;
  sessionId: string;
  ts: number;
};

export type AdImpressionResult =
  | { ok: true; impression: AdImpressionRecord }
  | { ok: false; reason: string };

export function createAdImpression(
  input: AdImpressionInput,
  now: number = Date.now()
): AdImpressionResult {
  const adId = typeof input.adId === "string" ? input.adId.trim() : "";
  const campaignId = typeof input.campaignId === "string" ? input.campaignId.trim() : "";
  const userId = typeof input.userId === "string" ? input.userId.trim() : "";
  const placement = typeof input.placement === "string" ? input.placement.trim() : "";
  const sessionId = typeof input.sessionId === "string" ? input.sessionId.trim() : "";
  const ts =
    typeof input.ts === "number" && Number.isFinite(input.ts)
      ? input.ts
      : now;

  if (!adId) return { ok: false, reason: "missing_ad_id" };
  if (!campaignId) return { ok: false, reason: "missing_campaign_id" };
  if (!userId) return { ok: false, reason: "missing_user_id" };
  if (!placement) return { ok: false, reason: "missing_placement" };
  if (!sessionId) return { ok: false, reason: "missing_session_id" };
  if (!Number.isFinite(ts) || ts <= 0) return { ok: false, reason: "invalid_timestamp" };

  return {
    ok: true,
    impression: {
      id: `imp_${Math.random().toString(36).slice(2, 10)}`,
      adId,
      campaignId,
      userId,
      placement,
      sessionId,
      ts,
    },
  };
}
