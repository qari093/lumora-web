import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/ads/serve?ownerId=OWNER_A
 * Creates a CPV view row (requires costCents in your schema) and returns a viewKey
 * so the client can later call /api/ads/convert with that key.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId") || "OWNER_A";

    // Choose a campaign — simplest: the test one we ensured exists
    const campaignId = "TEST_CAMPAIGN_1";

    // Create a view row with required costCents and unique idempotencyKey
    const viewKey = `view-${Date.now()}-${Math.floor(Math.random()*100000)}`;
    await prisma.cpvView.create({
      data: {
        idempotencyKey: viewKey,
        campaignId,
        costCents: 5, // minimal CPV cost
      },
    });

    // Return JSON (HTTP 200) — DO NOT return 204!
    return NextResponse.json({
      ok: true,
      campaignId,
      viewKey,
      // any extra metadata you want to show your client
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
