import { NextRequest, NextResponse } from "next/server";
import { createFypAdAudit } from "@/lib/ads/fypAdAudit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.totalFeedItems !== "number" ||
      typeof body?.sponsoredItems !== "number" ||
      typeof body?.injectedAds !== "number" ||
      typeof body?.eligibleAds !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_fyp_audit_fields" },
        { status: 400 }
      );
    }

    const audit = createFypAdAudit({
      totalFeedItems: body.totalFeedItems,
      sponsoredItems: body.sponsoredItems,
      injectedAds: body.injectedAds,
      eligibleAds: body.eligibleAds,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_fyp_ad_audit_v1",
      audit,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "fyp_ad_audit_failed" },
      { status: 500 }
    );
  }
}
