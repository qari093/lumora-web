import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /api/_health
 * Compatibility alias used by some infra/probes.
 * We keep it JSON + no-store, mirroring /api/healthz semantics.
 */
export async function GET() {
  return NextResponse.json(
    { ok: true, service: "lumora", ts: Date.now() },
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
      },
    }
  );
}
