import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vibeTagsLiteEnabled } from "@/lib/flags/vibeTags";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: { "cache-control": "no-store" } });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = (url.searchParams.get("userId") || "").trim();
  const limitRaw = Number(url.searchParams.get("limit") || "30");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, Math.floor(limitRaw))) : 30;

  // Hard errors only for caller mistakes / gating.
  if (!userId) return json({ ok: false, error: "userId_required" }, 400);
  if (typeof vibeTagsLiteEnabled === "function" && !vibeTagsLiteEnabled()) {
    return json({ ok: false, error: "vibe_tags_lite_disabled" }, 403);
  }

  // Never return 500 for this endpoint in dev/test; keep UI stable.
  // If DB/table/model isn't ready, we treat it as "no recent items yet".
  try {
    const delegate: any = (prisma as any).vibeTransaction;
    if (!delegate?.findMany) {
      return json({ ok: true, items: [], limit, ts: Date.now(), note: "vibeTransaction_delegate_missing" }, 200);
    }

    const items = await delegate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        createdAt: true,
        videoId: true,
        vibeSlug: true,
        watchMs: true,
      },
    });

    return json({ ok: true, items, limit, ts: Date.now() }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : String(e);
    return json(
      {
        ok: true,
        items: [],
        limit,
        ts: Date.now(),
        note: "recovered_from_error",
        recoveredError: msg.slice(0, 220),
      },
      200
    );
  }
}
