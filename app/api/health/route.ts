import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // DB connectivity check
    await prisma.$queryRaw`SELECT 1`;

    // basic metrics
    const videoCount = await prisma.video.count();
    const hasWebhookSecret = !!process.env.LUMORA_STREAM_WEBHOOK_SECRET;

    return NextResponse.json(
      {
        ok: true,
        service: "lumora",
        env: {
          LUMORA_STREAM_WEBHOOK_SECRET: hasWebhookSecret ? "present" : "missing",
          NODE_ENV: process.env.NODE_ENV || "unknown",
        },
        metrics: { videoCount },
        timestamp: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "health_check_failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
