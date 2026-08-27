import { createCampaign, type CampaignInput, type CampaignRecord } from "@/lib/ads/campaign";

export type CampaignCreationInput = CampaignInput & {
  creativeId?: string | null;
  targetPortals?: string[] | null;
};

export type CampaignCreationResult =
  | {
      ok: true;
      campaign: CampaignRecord;
      creativeId: string;
      targetPortals: string[];
    }
  | { ok: false; reason: string };

const ALLOWED_PORTALS = new Set(["FYP", "LIVE", "GMAR", "NEXA", "MOVIES", "MUSIC"]);

export function createCampaignFlow(
  input: CampaignCreationInput,
  now: number = Date.now()
): CampaignCreationResult {
  const creativeId = typeof input.creativeId === "string" ? input.creativeId.trim() : "";
  const targetPortals = Array.isArray(input.targetPortals)
    ? input.targetPortals.map((p) => String(p).trim().toUpperCase()).filter(Boolean)
    : [];

  if (!creativeId) return { ok: false, reason: "missing_creative_id" };
  if (targetPortals.length === 0) return { ok: false, reason: "missing_target_portals" };
  if (targetPortals.some((p) => !ALLOWED_PORTALS.has(p))) {
    return { ok: false, reason: "invalid_target_portal" };
  }

  const base = createCampaign(input, now);
  if (!base.ok) return { ok: false, reason: base.reason };

  return {
    ok: true,
    campaign: base.campaign,
    creativeId,
    targetPortals,
  };
}
