import { NextResponse } from "next/server";
import { readNexaOpsSnapshot } from "@/lib/nexa/ops_snapshot";
import { addSoftRateLimitHeaders } from "@/lib/nexa/rl";

export async function GET() {
  try {
    const snap = await readNexaOpsSnapshot();
    const res = NextResponse.json(snap, { status: snap.ok ? 200 : 404 });
    addSoftRateLimitHeaders(res);
    res.headers.set("x-nexa-ops", "1");
    res.headers.set("cache-control", "no-store, max-age=0");
    return res;
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    const res = NextResponse.json({ ok: false, ts: Date.now(), error: msg }, { status: 500 });
    addSoftRateLimitHeaders(res);
    res.headers.set("x-nexa-ops", "1");
    res.headers.set("cache-control", "no-store, max-age=0");
    return res;
  }
}
