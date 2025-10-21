import { NextRequest, NextResponse } from "next/server";
import { creativesForCampaign } from "@/src/lib/vendor/assign";
import { computeCampaignSpendEuros } from "@/src/lib/vendor/campaign_spend";
import { reqId } from "@/src/lib/reqid";

export async function GET(req: NextRequest) {
  const id = reqId();
  const u = new URL(req.url);
  const campaignId = u.searchParams.get("campaignId") || "";
  if (!campaignId) return NextResponse.json({ ok:false, error:"MISSING_CAMPAIGN", requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const list = creativesForCampaign(campaignId);
  const spent = computeCampaignSpendEuros(campaignId);
  return NextResponse.json({ ok:true, campaignId, creatives:list, spentEuros: spent, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
