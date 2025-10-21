import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { isOwnerAllowed } from "../../../../src/lib/owners";
import { takeToken, clientIp } from "../../../../src/lib/ratelimit";
import { getPublisherHostFrom, isPublisherAllowed } from "../../../../src/lib/publishers";

type ConvertPayload = {
  adId: string;
  ownerId: string;
  valueCents?: number;             // optional attributed value
  orderId?: string;                // optional external reference
  meta?: Record<string, any>;      // optional extra metadata
};

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
    const k = "convert::" + ip;
    const rl = takeToken(k, 15, 60000);
    if (!rl.ok) {
      return NextResponse.json({ ok:false, error:"RATE_LIMIT", waitSec: rl.waitSec }, { status: 429 });
    }
  }
  try {
    const body = (await req.json()) as Partial<ConvertPayload>;
    const adId = String(body?.adId || "");
    const ownerId = String(body?.ownerId || "");
  // isOwnerAllowed_guard_applied
  if (!isOwnerAllowed(ownerId)) {
    return NextResponse.json({ ok: false, error: "OWNER_FORBIDDEN" }, { status: 403 });
  }

    const valueCents = body?.valueCents ?? null;
    const orderId = body?.orderId ?? null;
    const meta = body?.meta ?? {};

    if (!adId || !ownerId) {
      return NextResponse.json(
        { ok: false, error: "adId and ownerId are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.adEvent.create({
      data: {
        viewKey: adId,
        campaignId: ownerId,
        action: "conversion" as any,
        metaJson: JSON.stringify({
          ...meta,
          valueCents,
          orderId,
          source: "ads.convert",
        }),
      },
      select: { id: true, viewKey: true, campaignId: true, action: true, createdAt: true },
    });

    return NextResponse.json(
      {
        ok: true,
        saved: {
          id: saved.id,
          adId: saved.viewKey,
          ownerId: saved.campaignId,
          event: saved.action,
          createdAt: saved.createdAt,
          valueCents,
          orderId,
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const runtime = "nodejs";
