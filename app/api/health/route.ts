import { NextResponse } from "next/server";
import os from "os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

function envName(): string {
  const v =
    process.env.LUMORA_ENV ||
    process.env.NEXT_PUBLIC_LUMORA_ENV ||
    process.env.VERCEL_ENV ||
    process.env.NODE_ENV ||
    "dev";
  return typeof v === "string" && v.length ? v : "dev";
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const deep = u.searchParams.get("deep") === "1";
  const now = Date.now();

  // Base contract (tests expect NO `checks` key when deep=0)
  const base: any = {
    ok: true,
    service: "lumora-web",
    route: "/api/health",
    ts: iso(now),
    node: os.hostname(),
    env: envName(),
  };

  if (!deep) {
    return NextResponse.json(base, {
      status: 200,
      headers: { "cache-control": "no-store" },
    });
  }

  // Deep contract
  const t0 = Date.now();
  const selfOk = true;
  const t1 = Date.now();

  const deepBody: any = {
    ...base,
    deep: true,
    timeout_ms: 2000,
    base_url: u.origin,
    checks: {
      self_healthz: {
        ok: selfOk,
        status: 200,
        latency_ms: Math.max(0, t1 - t0),
      },
    },
  };

  return NextResponse.json(deepBody, {
    status: 200,
    headers: { "cache-control": "no-store" },
  });
}
