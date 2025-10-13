import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "5", 10), 1), 25);

    // Basic feed stub: newest first (later we’ll plug in mood-aware ranking)
    const rows = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        cfUid: true,
        playbackId: true,
        status: true,
        durationSec: true,
        sizeBytes: true,
        flagged: true,
        reason: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, count: rows.length, rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unknown_error" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
