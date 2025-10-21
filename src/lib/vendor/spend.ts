import { ledgerFor } from "@/src/lib/wallet/mem";
import { listCampaigns } from "@/src/lib/vendor/campaign";

export function computeOwnerSpendEuros(ownerId: string): number {
  const rows = ledgerFor(ownerId);
  const spend = rows.filter(r => r.kind === "debit" && typeof r.reason === "string" && r.reason.startsWith("ads:"))
                    .reduce((s, r) => s + (r.euros || 0), 0);
  return +spend.toFixed(2);
}

export function computeCampaignsSpendMap(ownerId: string): Record<string, number> {
  // sum by cmp:<id>
  const rows = ledgerFor(ownerId).filter(r => r.kind === "debit" && typeof r.reason === "string" && r.reason.includes("cmp:"));
  const acc: Record<string, number> = {};
  for (const r of rows) {
    const m = String(r.reason).match(/cmp:([a-z0-9-]+)/i);
    if (m && m[1]) acc[m[1]] = +( (acc[m[1]] || 0) + (r.euros || 0) ).toFixed(2);
  }
  return acc;
}
