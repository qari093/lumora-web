export type AdClickInput = {
  adId?: string | null;
  campaignId?: string | null;
  userId?: string | null;
  placement?: string | null;
  sessionId?: string | null;
  targetUrl?: string | null;
  ts?: number | null;
};

export type AdClickRecord = {
  id: string;
  adId: string;
  campaignId: string;
  userId: string;
  placement: string;
  sessionId: string;
  targetUrl: string;
  ts: number;
};

export type AdClickResult =
  | { ok: true; click: AdClickRecord }
  | { ok: false; reason: string };

function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function createAdClick(
  input: AdClickInput,
  now: number = Date.now()
): AdClickResult {
  const adId = typeof input.adId === "string" ? input.adId.trim() : "";
  const campaignId = typeof input.campaignId === "string" ? input.campaignId.trim() : "";
  const userId = typeof input.userId === "string" ? input.userId.trim() : "";
  const placement = typeof input.placement === "string" ? input.placement.trim() : "";
  const sessionId = typeof input.sessionId === "string" ? input.sessionId.trim() : "";
  const targetUrl = typeof input.targetUrl === "string" ? input.targetUrl.trim() : "";
  const ts =
    typeof input.ts === "number" && Number.isFinite(input.ts)
      ? input.ts
      : now;

  if (!adId) return { ok: false, reason: "missing_ad_id" };
  if (!campaignId) return { ok: false, reason: "missing_campaign_id" };
  if (!userId) return { ok: false, reason: "missing_user_id" };
  if (!placement) return { ok: false, reason: "missing_placement" };
  if (!sessionId) return { ok: false, reason: "missing_session_id" };
  if (!targetUrl) return { ok: false, reason: "missing_target_url" };
  if (!isSafeUrl(targetUrl)) return { ok: false, reason: "invalid_target_url" };
  if (!Number.isFinite(ts) || ts <= 0) return { ok: false, reason: "invalid_timestamp" };

  return {
    ok: true,
    click: {
      id: `clk_${Math.random().toString(36).slice(2, 10)}`,
      adId,
      campaignId,
      userId,
      placement,
      sessionId,
      targetUrl,
      ts,
    },
  };
}
