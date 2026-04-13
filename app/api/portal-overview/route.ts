import { NextResponse } from "next/server";
import { getPortalOverview } from "@/lib/portal/getPortalOverview";

export async function GET() {
  try {
    const overview = getPortalOverview();
    return NextResponse.json({ ok: true, overview });
  } catch {
    return NextResponse.json(
      { ok: false, error: "portal_overview_failed" },
      { status: 500 }
    );
  }
}
