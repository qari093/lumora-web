import { NextResponse } from "next/server";
import {
  createQuietGiftTransfer,
  persistQuietGiftTransfer,
  validateQuietGiftTransfer
} from "@/src/core/creator-alchemy/wallet";
import {
  requireUserSession,
  userPrivateNoStoreHeaders
} from "@/src/lib/auth/requireUserSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function POST(request: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();

    const suppliedViewerId =
      typeof body?.viewerId === "string" ? body.viewerId.trim() : "";

    if (suppliedViewerId && suppliedViewerId !== auth.identity.userId) {
      return json(403, {
        ok: false,
        error: "forbidden_viewer_scope",
      });
    }

    const creatorId =
      typeof body?.creatorId === "string" ? body.creatorId.trim() : "";

    if (!creatorId) {
      return json(400, {
        ok: false,
        error: "creator_required",
      });
    }

    if (creatorId === auth.identity.userId) {
      return json(409, {
        ok: false,
        error: "self_gift_not_allowed",
      });
    }

    const transfer = createQuietGiftTransfer({
      id: String(body?.id || `gift-${Date.now()}`),
      viewerId: auth.identity.userId,
      creatorId,
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
      return json(400, {
        ok: false,
        error: validation.reason,
      });
    }

    const entries = persistQuietGiftTransfer(transfer);

    return json(200, {
      ok: true,
      transfer,
      entries,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "quiet_gift_failed",
    });
  }
}
