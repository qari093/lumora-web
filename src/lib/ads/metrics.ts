import { dumpAll } from "@/src/lib/ads/track";
import { getCreativeById } from "@/src/lib/ads/fixtures";

export type CreativeRow = { creativeId: string; title?: string; imps: number; clicks: number };
export type OwnerTotals = { ownerId: string; imps: number; clicks: number; byCreative: CreativeRow[] };

export function aggregateOwner(ownerId: string): OwnerTotals {
  const rows = dumpAll();
  const byCreative = new Map<string, CreativeRow>();
  let imps = 0, clicks = 0;

  for (const { key } of rows) {
    // key = type::cid::rid::ip::ua
    const parts = key.split("::");
    if (parts.length < 2) continue;
    const type = parts[0];
    const cid = parts[1];

    const creative = getCreativeById(cid);
    if (!creative || creative.ownerId !== ownerId) continue;

    let row = byCreative.get(cid);
    if (!row) {
      row = { creativeId: cid, title: creative.title, imps: 0, clicks: 0 };
      byCreative.set(cid, row);
    }
    if (type === "imp") { row.imps++; imps++; }
    else if (type === "click") { row.clicks++; clicks++; }
  }

  return { ownerId, imps, clicks, byCreative: Array.from(byCreative.values()).sort((a,b)=> (b.imps+b.clicks) - (a.imps+a.clicks)) };
}
