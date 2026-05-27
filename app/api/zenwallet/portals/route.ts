import { NextResponse } from "next/server";
import { PORTAL_POLICIES } from "@/src/core/zenwallet/portals/portalControl";

export async function GET() {
  return NextResponse.json({ ok: true, policies: PORTAL_POLICIES });
}
