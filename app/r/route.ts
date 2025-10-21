import { NextResponse } from "next/server";
import { prisma } from "../../src/lib/prisma";
import { charge, CLICK_COST_CENTS, CURRENCY } from "../../src/lib/billing";
import { isOwnerAllowed } from "../../src/lib/owners";
import { takeToken, clientIp } from "../../src/lib/ratelimit";
import { getPublisherHostFrom, isPublisherAllowed } from "../../src/lib/publishers";

// Minimal mock inventory (kept local to avoid touching serve)
const INVENTORY = [
  {
    id: "ad_demo_001",
    ownerId: "OWNER_A",
    clickUrl: "https://example.com/local-coffee",
  },
];

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
    const k = "redirect::" + ip;
    const rl = takeToken(k, 60, 30000);
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
      return NextResponse.json({ ok: false, error: "adId and ownerId are required" }, { status: 400 });
    }

    const ad = INVENTORY.find(a => a.id === adId && a.ownerId === ownerId);
    if (!ad) {
      return NextResponse.json({ ok: false, error: "AD_NOT_FOUND" }, { status: 404 });
    }

    // Persist click event
    const saved = await prisma.adEvent.create({
      data: {
        viewKey: adId,
        campaignId: ownerId,
        action: "click" as any,
        metaJson: JSON.stringify({ adId, ownerId, source: "redirect" }),
      },
      select: { id: true, createdAt: true },
    });

    // Charge wallet (best-effort; redirect regardless)
    try {
      await charge(ownerId, CLICK_COST_CENTS, {
        adId,
        event: "click",
        reason: "charge-click",
        currency,
      });
    } catch (e) {
      // swallow billing errors; keep UX fast
    }

    // 302 to destination
    return NextResponse.redirect(ad.clickUrl, { status: 302 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const runtime = "nodejs";
