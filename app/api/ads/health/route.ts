import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Json = Record<string, unknown>;

function nowIso(): string {
  return new Date().toISOString();
}

function safeNumber(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
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

/**
 * Best-effort Prisma resolution. We do NOT assume any specific export name.
 * This is intentionally defensive to prevent health endpoints from crashing.
 */
async function tryResolvePrisma(): Promise<any | null> {
  const candidates = [
    "@/lib/prisma",
    "@/lib/db",
    "@/app/_server/db",
    "@/app/_server/prisma",
    "@/server/db",
    "@/server/prisma",
    "../../_server/db",
    "../../_server/prisma",
    "../../../lib/prisma",
    "../../../lib/db",
  ];

  for (const spec of candidates) {
    try {
      const mod: any = await import(spec);
      const prisma =
        mod?.prisma ??
        mod?.db ??
        mod?.default ??
        mod?.client ??
        mod?.Prisma ??
        null;

      if (prisma && typeof prisma === "object") return prisma;
    } catch {
      // ignore
    }
  }
  return null;
}

async function safeCount(prisma: any, modelName: string, ms: number): Promise<number | null> {
  try {
    const model = prisma?.[modelName];
    const fn = model?.count;
    if (typeof fn !== "function") return null;
    const v = await withTimeout(Promise.resolve(fn.call(model)), ms, `count:${modelName}`);
    return typeof v === "number" ? v : null;
  } catch {
    return null;
  }
}

async function safeDbPing(prisma: any, ms: number): Promise<Json> {
  if (!prisma) return { ok: false, reason: "prisma_unavailable" };

  // Prefer $queryRaw if available.
  try {
    const q = prisma?.$queryRaw;
    if (typeof q === "function") {
      await withTimeout(Promise.resolve(q`SELECT 1`), ms, "db:ping");
      return { ok: true };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // Fallback: $connect if available.
  try {
    const c = prisma?.$connect;
    if (typeof c === "function") {
      await withTimeout(Promise.resolve(c.call(prisma)), ms, "db:connect");
      return { ok: true };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: false, reason: "no_ping_method" };
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const deep = u.searchParams.get("deep") === "1";
  const ms = safeNumber(u.searchParams.get("timeout_ms")) ?? 1200;

  const base: Json = {
    ok: true,
    system: "ads",
    route: "/api/ads/health",
    ts: nowIso(),
  };

  if (!deep) return NextResponse.json(base, { status: 200 });

  const prisma = await tryResolvePrisma();

  const checks: Json = {
    prisma_resolved: Boolean(prisma),
    db_ping: await safeDbPing(prisma, ms),
  };

  // Best-effort counts; only queried when model exists and has count()
  const modelCandidates = [
    "adCampaign",
    "ad_campaign",
    "campaign",
    "adsCampaign",
    "ad",
    "ads",
    "adImpression",
    "ad_impression",
    "impression",
    "click",
    "adClick",
    "ad_click",
  ];

  const counts: Record<string, number> = {};
  for (const name of modelCandidates) {
    const c = await safeCount(prisma, name, ms);
    if (typeof c === "number") counts[name] = c;
  }

  return NextResponse.json(
    {
      ...base,
      deep: true,
      timeout_ms: ms,
      checks,
      counts,
    },
    { status: 200 }
  );
}
