import { NextResponse } from "next/server";
import { prisma } from "../../src/lib/prisma";
import { charge, IMPRESSION_COST_CENTS, CURRENCY } from "../../src/lib/billing";
import { isOwnerAllowed } from "../../src/lib/owners";
import { takeToken, clientIp } from "../../src/lib/ratelimit";
import { getPublisherHostFrom, isPublisherAllowed } from "../../src/lib/publishers";

// Transparent 1x1 GIF
const GIF_BASE64 =
  "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
const GIF_BYTES = Uint8Array.from(atob(GIF_BASE64), c => c.charCodeAt(0));

export async function GET(req: Request) {
    // publisher_guard_applied
  {
    const pub = getPublisherHostFrom(req);
    // Only enforce if publisher is present; local testing (no Referer/pub) continues to work.
    if (pub && !isPublisherAllowed(pub)) {
      return NextResponse.json({ ok:false, error:"PUBLISHER_FORBIDDEN", publisher: pub }, { status: 403 });
    }
  }
// rate_limit_guard_applied
  {
    const ip = clientIp(req);
    const k = "pixel::" + ip;
    const rl = takeToken(k, 120, 30000);
    if (!rl.ok) {
      return NextResponse.json({ ok:false, error:"RATE_LIMIT", waitSec: rl.waitSec }, { status: 429 });
    }
  }
  try {
    const url = new URL(req.url);
    const adId = url.searchParams.get("adId") || "";
    const ownerId = url.searchParams.get("ownerId") || "";
  // isOwnerAllowed_guard_applied
  if (!isOwnerAllowed(ownerId)) {
    return NextResponse.json({ ok: false, error: "OWNER_FORBIDDEN" }, { status: 403 });
  }

    const currency = url.searchParams.get("currency") || CURRENCY;

    if (!adId || !ownerId) {
      // Return pixel anyway to avoid layout jank, but do not record/charge
      return new NextResponse(GIF_BYTES, {
        status: 200,
        headers: {
          "content-type": "image/gif",
          "cache-control": "no-store",
        },
      });
    }

    // Log impression (idempotency intentionally omitted for demo)
    await prisma.adEvent.create({
      data: {
        viewKey: adId,
        campaignId: ownerId,
        action: "impression" as any,
        metaJson: JSON.stringify({ adId, ownerId, source: "pixel" }),
      },
      select: { id: true },
    });

    // Best-effort wallet charge; never block pixel
    try {
      await charge(ownerId, IMPRESSION_COST_CENTS, {
        adId,
        event: "impression",
        reason: "charge-impression",
        currency,
      });
    } catch (_) {}

    return new NextResponse(GIF_BYTES, {
      status: 200,
      headers: {
        "content-type": "image/gif",
        "cache-control": "no-store",
      },
    });
  } catch {
    return new NextResponse(GIF_BYTES, {
      status: 200,
      headers: {
        "content-type": "image/gif",
        "cache-control": "no-store",
      },
    });
  }
}

export const runtime = "nodejs";
