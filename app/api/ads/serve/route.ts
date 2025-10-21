import { NextRequest, NextResponse } from "next/server";
import { pickCreative } from "@/src/lib/ads/fixtures";
import { checkCaps } from "@/src/lib/ads/caps";
import { reqId } from "@/src/lib/reqid";

function getIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const xr = req.headers.get("x-real-ip");
  if (xr) return xr.trim();
  return "0.0.0.0"; // dev fallback
}

export async function GET(req: NextRequest) {
  const id = reqId();
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId");
  const ip = getIp(req);
  const capKey = `${ownerId||"_"}::${ip}`;

  const verdict = checkCaps(capKey);
  if (!verdict.allowed) {
    const body = { ok: false as const, decision: null, reason: verdict.reason, retryAfterMs: verdict.retryAfterMs ?? 0, caps: verdict.meta, requestId: id };
    return NextResponse.json(body, { status: 200, headers: { "x-request-id": id } });
  }

  const creative = pickCreative(ownerId);
  if (!creative) {
    const body = { ok: true, decision: null, reason: "NO_CREATIVE" as const, caps: verdict.meta, requestId: id };
    return NextResponse.json(body, { status: 200, headers: { "x-request-id": id } });
  }

  const decision = {
    ttlMs: 30_000, // hint for client cache of the decision
    creative,
    tracking: {
      // Placeholder tracking URLs (to be implemented in Step 3)
      impressionUrl: `/api/ads/imp?cid=${encodeURIComponent(creative.id)}&rid=${encodeURIComponent(id)}`,
      clickUrl: `/api/ads/click?cid=${encodeURIComponent(creative.id)}&rid=${encodeURIComponent(id)}`,
    },
  };

  const body = { ok: true, decision, caps: verdict.meta, requestId: id };
  return NextResponse.json(body, { status: 200, headers: { "x-request-id": id } });
}

export const dynamic = "force-dynamic"; // ensure fresh decisions in dev
