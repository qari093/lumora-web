import { NextResponse } from "next/server";
import { getPortalStatusManifest } from "@/lib/portal/getPortalStatusManifest";

export async function GET() {
  try {
    const manifest = getPortalStatusManifest();
    return NextResponse.json({ ok: true, manifest });
  } catch {
    return NextResponse.json(
      { ok: false, error: "portal_status_manifest_failed" },
      { status: 500 }
    );
  }
}
