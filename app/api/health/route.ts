import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Json = Record<string, unknown>;

function safeNumber(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

function nowIso(): string {
  return new Date().toISOString();
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  if (!Number.isFinite(ms) || ms <= 0) return p;
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout:${label}:${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

async function optionalFetchSelfHealth(baseUrl: string, ms: number): Promise<Json> {
  const url = new URL("/api/healthz", baseUrl).toString();
  try {
    const res = await withTimeout(fetch(url, { cache: "no-store" }), ms, "self:healthz");
    return { ok: res.ok, status: res.status };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: null, error: msg };
  }
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const deep = u.searchParams.get("deep") === "1";

  // NEVER block the base health response on external IO.
  const base: Json = {
    ok: true,
    service: "lumora-web",
    route: "/api/health",
    ts: nowIso(),
    node: process.version,
    env: process.env.NODE_ENV ?? "unknown",
  };

  if (!deep) return NextResponse.json(base, { status: 200 });

  const ms = safeNumber(u.searchParams.get("timeout_ms")) ?? 1500;

  // Deep checks are best-effort + time-bounded.
  const checks: Json = {};
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://127.0.0.1:8088";

  try {
    checks.self_healthz = await optionalFetchSelfHealth(baseUrl, ms);
  } catch (e) {
    checks.self_healthz = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(
    {
      ...base,
      deep: true,
      timeout_ms: ms,
      base_url: baseUrl,
      checks,
    },
    { status: 200 }
  );
}
