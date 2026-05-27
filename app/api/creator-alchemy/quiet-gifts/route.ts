import { NextResponse } from "next/server";
import {
  createQuietGiftTransfer,
  persistQuietGiftTransfer,
  validateQuietGiftTransfer
} from "@/src/core/creator-alchemy/wallet";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const transfer = createQuietGiftTransfer({
      id: String(body?.id || `gift-${Date.now()}`),
      viewerId: String(body?.viewerId || ""),
      creatorId: String(body?.creatorId || ""),
      giftType: body?.giftType,
      createdAt: new Date().toISOString()
    });

    const validation = validateQuietGiftTransfer({
      transfer,
      viewerDailyGiftCount: Number(body?.viewerDailyGiftCount || 0),
      repeatedCreatorGiftRatio: Number(body?.repeatedCreatorGiftRatio || 0),
      suspiciousDevice: Boolean(body?.suspiciousDevice)
    });

    if (!validation.ok) {
      return NextResponse.json({ ok: false, error: validation.reason }, { status: 400 });
    }

    const entries = persistQuietGiftTransfer(transfer);

    return NextResponse.json({ ok: true, transfer, entries });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "quiet_gift_failed" },
      { status: 500 }
    );
  }
}
