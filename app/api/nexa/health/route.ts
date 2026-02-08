import { NextResponse } from "next/server";
import { getNexaRuntimeHealth } from "@/lib/nexa/runtime";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  try {
    const payload = getNexaRuntimeHealth();
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "cache-control": "no-store, max-age=0",
        "x-nexa-health": "1",
      },
    });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return NextResponse.json(
      { ok: false, error: msg, ts: Date.now() },
      { status: 500, headers: { "cache-control": "no-store, max-age=0" } }
    );
  }
}
