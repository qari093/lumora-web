import { NextResponse } from "next/server";

// /api/healthz — stable alias for platform health checks.
// Contract MUST match tests/health/health_contract_unit.test.ts expectations:
// { ok: true, service: string, ts: number, ... }
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "healthz",
      ts: Date.now(),
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    }
  );
}
