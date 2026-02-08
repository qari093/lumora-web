import { NextResponse } from "next/server";
import { getNexaInfo } from "@/lib/nexa/info";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  try {
    const payload = getNexaInfo();
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "cache-control": "no-store, max-age=0",
        "x-nexa-info": "1",
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
