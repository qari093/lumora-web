import { NextResponse } from "next/server";
import { getNexaRuntimeMetrics } from "@/lib/nexa/metrics";
import { rateLimitHeaders } from "@/lib/nexa/rl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  try {
    const payload = getNexaRuntimeMetrics();
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "cache-control": "no-store, max-age=0",
        "x-nexa-metrics": "1",
        ...rateLimitHeaders(),
      },
    });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return NextResponse.json(
      { ok: false, error: msg, ts: Date.now() },
      { status: 500, headers: { "cache-control": "no-store, max-age=0", ...rateLimitHeaders() } }
    );
  }
}
