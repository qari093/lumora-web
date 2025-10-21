import { NextRequest, NextResponse } from "next/server";
import { aggregateOwner } from "@/src/lib/ads/metrics";
import { computeOwnerSpendEuros } from "@/src/lib/vendor/spend";
import { reqId } from "@/src/lib/reqid";

export async function GET(req: NextRequest) {
  const id = reqId();
  const u = new URL(req.url);
  const ownerId = u.searchParams.get("ownerId") || "";
  if (!ownerId) return NextResponse.json({ ok:false, error:"MISSING_OWNER", requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const agg = aggregateOwner(ownerId);
  const spent = computeOwnerSpendEuros(ownerId);

  return NextResponse.json({ ok:true, ownerId, totals: { imps: agg.imps, clicks: agg.clicks, spentEuros: spent }, byCreative: agg.byCreative, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
