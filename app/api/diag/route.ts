import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startedAt = Date.now();
  try {
    const videoCount = await prisma.video.count();
    const dbLatencyMs = Date.now() - startedAt;

    const mem = process.memoryUsage();
    return NextResponse.json(
      {
        ok: true as const,
        service: "lumora",
        versions: { node: process.version },
        db: { videoCount, approxLatencyMs: dbLatencyMs },
        runtime: {
          uptimeSec: Math.round(process.uptime()),
          rssMB: Math.round(mem.rss / (1024 * 1024)),
          heapUsedMB: Math.round(mem.heapUsed / (1024 * 1024)),
        },
        timestamp: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false as const,
        error: err?.message || "diag_failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
