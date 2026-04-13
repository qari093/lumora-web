export type CampaignInput = {
  campaignId?: string | null;
  vendorId?: string | null;
  name?: string | null;
  dailyBudget?: number | null;
  lifetimeBudget?: number | null;
  startAt?: number | null;
  endAt?: number | null;
  isActive?: boolean | null;
};

export type CampaignRecord = {
  campaignId: string;
  vendorId: string;
  name: string;
  dailyBudget: number;
  lifetimeBudget: number;
  startAt: number;
  endAt: number;
  isActive: boolean;
};

export type CampaignResult =
  | { ok: true; campaign: CampaignRecord }
  | { ok: false; reason: string };

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function createCampaign(
  input: CampaignInput,
  now: number = Date.now()
): CampaignResult {
  const campaignId = typeof input.campaignId === "string" ? input.campaignId.trim() : "";
  const vendorId = typeof input.vendorId === "string" ? input.vendorId.trim() : "";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const dailyBudget =
    typeof input.dailyBudget === "number" && Number.isFinite(input.dailyBudget)
      ? round2(input.dailyBudget)
      : NaN;
  const lifetimeBudget =
    typeof input.lifetimeBudget === "number" && Number.isFinite(input.lifetimeBudget)
      ? round2(input.lifetimeBudget)
      : NaN;
  const startAt =
    typeof input.startAt === "number" && Number.isFinite(input.startAt)
      ? input.startAt
      : NaN;
  const endAt =
    typeof input.endAt === "number" && Number.isFinite(input.endAt)
      ? input.endAt
      : NaN;
  const isActive = Boolean(input.isActive);

  if (!campaignId) return { ok: false, reason: "missing_campaign_id" };
  if (!vendorId) return { ok: false, reason: "missing_vendor_id" };
  if (!name) return { ok: false, reason: "missing_name" };
  if (!Number.isFinite(dailyBudget) || dailyBudget <= 0) {
    return { ok: false, reason: "invalid_daily_budget" };
  }
  if (!Number.isFinite(lifetimeBudget) || lifetimeBudget <= 0) {
    return { ok: false, reason: "invalid_lifetime_budget" };
  }
  if (dailyBudget > lifetimeBudget) {
    return { ok: false, reason: "daily_exceeds_lifetime" };
  }
  if (!Number.isFinite(startAt) || startAt <= 0) {
    return { ok: false, reason: "invalid_start" };
  }
  if (!Number.isFinite(endAt) || endAt <= startAt) {
    return { ok: false, reason: "invalid_end" };
  }

  return {
    ok: true,
    campaign: {
      campaignId,
      vendorId,
      name,
      dailyBudget,
      lifetimeBudget,
      startAt,
      endAt,
      isActive,
    },
  };
}
