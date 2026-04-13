import { NextResponse } from "next/server";
import { createCampaignFlow } from "@/lib/ads/campaignCreation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = createCampaignFlow(body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, reason: result.reason },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, campaign: result });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid_json" },
      { status: 400 }
    );
  }
}
