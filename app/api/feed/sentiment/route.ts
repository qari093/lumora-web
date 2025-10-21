import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function scoreVideo(v: {
  flagged: boolean | null;
  playbackId: string | null;
  durationSec: number | null;
  sizeBytes: number | null;
}) {
  // Transparent, starter scoring:
  // - Penalize flagged
  // - Bonus if ready to stream (has playbackId)
  // - Duration sweet spot ~105s (±40 window)
  // - Light bonus for reasonable file size (up to ~30 MB)
  let s = 0;

  if (v.flagged) s -= 1000;
  if (v.playbackId) s += 50;

  const duration = v.durationSec ?? 0;
  const durationTarget = 105;
  const durationDelta = Math.abs(duration - durationTarget);
  s += 40 - Math.min(40, durationDelta); // max +40 when near 105s

  const sizeMB = (v.sizeBytes ?? 0) / (1024 * 1024);
  s += Math.min(30, Math.floor(sizeMB)); // up to +30

  return s;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") || "10")));

    // Grab a recent window to score
    const rows = await prisma.video.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    const scored = rows
      .map((v) => ({ ...v, _score: scoreVideo(v) }))
      .sort((a, b) => b._score - a._score)
      .slice(0, limit);

    return NextResponse.json(
      { ok: true, count: scored.length, rows: scored },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "unknown_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
