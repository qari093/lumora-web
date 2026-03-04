import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vibeTagsLiteEnabled } from "@/lib/flags/vibeTags";

function json(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function isEnabled(): boolean {
  try {
    const v: any = vibeTagsLiteEnabled as any;
    return typeof v === "function" ? !!v() : !!v;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  try {
    if (!isEnabled()) return json({ ok: false, error: "vibe_tags_lite_disabled" }, 403);

    const url = new URL(req.url);
    const limitRaw = url.searchParams.get("limit") || "80";
    const limit = Math.max(1, Math.min(200, Number(limitRaw) || 80));

    // Schema in this repo does NOT include isActive (observed in tests); we return all tags.
    const tags = await prisma.vibeTag.findMany({
      take: limit,
      orderBy: [{ category: "asc" }, { intensity: "desc" }, { createdAt: "asc" }],
      select: {
        slug: true,
        label: true,
        category: true,
        intensity: true,
        rarity: true,
      },
    });

    return json({ ok: true, items: tags, ts: Date.now() }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
