import { ledgerFor } from "@/src/lib/wallet/mem";
import { getCampaign, Campaign } from "@/src/lib/vendor/campaign";

export function computeCampaignSpendEuros(campaignId: string): number {
  const rows = Array.from(ledgerFor((getCampaign(campaignId)?.ownerId || "")))
    .filter(r => r.kind === "debit" && typeof r.reason === "string" && r.reason.includes(`cmp:${campaignId}`));
  const s = rows.reduce((t, r) => t + (r.euros || 0), 0);
  return +s.toFixed(2);
}
export function isCampaignLive(c: Campaign): boolean {
  if (!c) return false;
  if (c.state === "ended" || c.state === "paused") return false;
  // if dates provided, enforce window
  const now = Date.now();
  if (typeof c.startAt === "number" && c.startAt && now < c.startAt) return false;
  if (typeof c.endAt === "number" && c.endAt && now > c.endAt) return false;
  // "draft" is considered not live until explicitly resumed
  return c.state === "live";
}
