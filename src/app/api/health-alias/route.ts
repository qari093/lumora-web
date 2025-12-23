import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Alias endpoint used only as a rewrite target for the legacy external path /api/_health.
 * App Router treats `_health` as a private segment in some setups; rewriting avoids that entirely.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { ok: true, service: "lumora", route: "/api/_health", ts: new Date().toISOString() },
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "x-health-legacy-target": "/api/healthz",
        // Contract expected by tests (they historically asserted middleware rewrite header)
      }
    }
  );
}
