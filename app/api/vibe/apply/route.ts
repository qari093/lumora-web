import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { vibeTagsLiteEnabled } from "@/lib/flags/vibeTags";

const prisma = new PrismaClient();

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function clampInt(v: any, min: number, max: number) {
  const n = typeof v === "number" ? v : parseInt(String(v ?? ""), 10);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export async function POST(req: NextRequest) {
  try {
    if (!vibeTagsLiteEnabled()) return json({ ok: false, error: "vibe_tags_lite_disabled" }, 403);

    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") return json({ ok: false, error: "invalid_json" }, 400);

    const userId = String((payload as any).userId || "");
    const videoId = String((payload as any).videoId || "");
    const vibeSlug = String((payload as any).vibeSlug || "");
    const watchMs = clampInt((payload as any).watchMs, 0, 60 * 60 * 1000);

    if (!userId || !videoId || !vibeSlug) return json({ ok: false, error: "missing_fields" }, 400);
    if (watchMs < 5000) return json({ ok: false, error: "watch_gate_5s" }, 400);

    const vibe = await prisma.vibeTag.findUnique({ where: { slug: vibeSlug } });
    if (!vibe) return json({ ok: false, error: "vibe_not_found" }, 404);

    const count = await prisma.vibeTransaction.count({ where: { userId, videoId } });
    if (count >= 3) return json({ ok: false, error: "max_tags_per_video" }, 429);

    const created = await prisma.$transaction(async (tx) => {
      const vt = await tx.vibeTransaction.create({
        data: {
          userId,
          videoId,
          vibeId: vibe.id,
          category: vibe.category,
          watchMs,
          entropy: null,
          isPassive: false,
        },
      });

      try {
        // Only works if Video row exists; ignore otherwise.
        // @ts-ignore
        await tx.video.update({ where: { id: videoId }, data: { totalVibes: { increment: 1 } } });
      } catch {}
      return vt;
    });

    return json({ ok: true, transactionId: created.id, vibe: { slug: vibe.slug, category: vibe.category } }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("constraint")) {
      return json({ ok: false, error: "duplicate_vibe" }, 409);
    }
    return json({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
