import { NextResponse } from "next/server";
import { getActivePortals } from "@/lib/portal/getActivePortals";

export async function GET() {
  try {
    const portals = getActivePortals();
    return NextResponse.json({ ok: true, portals });
  } catch {
    return NextResponse.json({ ok: false, error: "portal_fetch_failed" }, { status: 500 });
  }
}
