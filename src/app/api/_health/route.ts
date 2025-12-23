import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { ok: true, service: "lumora", route: "/api/_health", ts: new Date().toISOString() },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
