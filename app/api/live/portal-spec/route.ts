import { NextResponse } from "next/server";

export const runtime = "nodejs";

const LIVE_PORTAL_SPEC_V2 = {
  version: "v2",
  name: "Lumora Live",
  capabilities: ["rooms", "reactions", "status"],
};

export async function GET() {
  return NextResponse.json({ ok: true, spec: LIVE_PORTAL_SPEC_V2, ts: new Date().toISOString() }, { status: 200 });
}
