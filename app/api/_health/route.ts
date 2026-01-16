import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // Must be fast, side-effect free, and never depend on DB/network/env.
  // Used by CI integration tests and platform health probes.
  return NextResponse.json(
    {
      ok: true,
      route: "/api/_health",
      service: "lumora",
      ts: Date.now(),
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store, max-age=0",
      },
    }
  );
}
