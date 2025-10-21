import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { charge, IMPRESSION_COST_CENTS, CLICK_COST_CENTS, CURRENCY } from "../../../../src/lib/billing";
import { corsJson, corsNoContent } from "../../../../src/lib/cors";
import { isOwnerAllowed } from "../../../../src/lib/owners";
import { takeToken, clientIp } from "../../../../src/lib/ratelimit";
import { getPublisherHostFrom, isPublisherAllowed } from "../../../../src/lib/publishers";

export function OPTIONS() { return corsNoContent(); }

type TrackEvent = "impression" | "click";

export async function POST(req: Request) {
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
    const k = "track::" + ip;
    const rl = takeToken(k, 60, 30000);
    if (!rl.ok) {
      return NextResponse.json({ ok:false, error:"RATE_LIMIT", waitSec: rl.waitSec }, { status: 429 });
    }
  }
  try {
    const body = await req.json();
    const adId = String(body?.adId || "");
    const ownerId = String(body?.ownerId || "");
  // isOwnerAllowed_guard_applied
  if (!isOwnerAllowed(ownerId)) {
    return NextResponse.json({ ok: false, error: "OWNER_FORBIDDEN" }, { status: 403 });
  }

    const ev = String(body?.event || "") as TrackEvent;
    const currency = String(body?.currency || CURRENCY);

    if (!adId || !ownerId || (ev !== "impression" && ev !== "click")) {
      return corsJson(
        { ok: false, error: "Invalid payload", schema: { adId: "string", ownerId: "string", event: "impression|click" } },
        { status: 400 }
      );
    }

    const saved = await prisma.adEvent.create({
      data: {
        viewKey: adId,
        campaignId: ownerId,
        action: ev as any,
        metaJson: JSON.stringify({ adId, ownerId, source: "ads.track" }),
      },
      select: { id: true, viewKey: true, campaignId: true, action: true, createdAt: true },
    });

    const cents = ev === "impression" ? IMPRESSION_COST_CENTS : CLICK_COST_CENTS;
    let newBalance: number | null = null;
    try {
      newBalance = await charge(ownerId, cents, { adId, event: ev, reason: `charge-${ev}`, currency });
    } catch (e: any) {
      return corsJson(
        { ok: true, saved: { id: saved.id, adId: saved.viewKey, ownerId: saved.campaignId, event: saved.action, createdAt: saved.createdAt }, charge: { ok: false, error: String(e?.message || e), attemptedCents: cents, currency } },
        { status: 200 }
      );
    }

    return corsJson(
      {
        ok: true,
        saved: { id: saved.id, adId: saved.viewKey, ownerId: saved.campaignId, event: saved.action, createdAt: saved.createdAt },
        charge: { ok: true, debitedCents: cents, balanceCents: newBalance, currency },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return corsJson({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const runtime = "nodejs";
