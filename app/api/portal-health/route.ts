import { NextResponse } from "next/server";
import { getPortalHealthMatrix } from "@/lib/portal/getPortalHealthMatrix";

export async function GET() {
  try {
    const health = getPortalHealthMatrix();
    return NextResponse.json({ ok: true, health });
  } catch {
    return NextResponse.json(
      { ok: false, error: "portal_health_failed" },
      { status: 500 }
    );
  }
}
