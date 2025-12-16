import { NextResponse } from "next/server";

export async function GET() {
  // "state" + "snapshot" semantics for contract guards.
  return NextResponse.json({
    ok: true,
    state: "latest",
    snapshot: "ephemeral",
    asOf: new Date().toISOString(),
    composite: { calm: 0.5, focus: 0.5, joy: 0.5, risk: 0.0 },
  });
}
