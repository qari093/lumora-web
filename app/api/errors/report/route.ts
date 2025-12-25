import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function safeStr(v: unknown, max = 2000) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(req: NextRequest) {
  const enabled = process.env.LUMORA_ERROR_MONITORING_ENABLED === "1";
  const mode = process.env.LUMORA_ERROR_MONITORING_MODE || "silent";
  if (!enabled) return NextResponse.json({ ok: true, enabled: false }, { status: 200 });

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const report = {
    ts: safeStr(body?.ts, 64) || new Date().toISOString(),
    level: safeStr(body?.level, 24) || "error",
    message: safeStr(body?.message, 800),
    name: safeStr(body?.name, 120),
    stack: safeStr(body?.stack, 4000),
    route: safeStr(body?.route, 200),
    ua: safeStr(body?.ua, 400),
    // do not echo arbitrary payloads in silent mode
    meta: mode === "silent" ? undefined : body?.meta ?? undefined
  };

  // SILENT MODE: acknowledge only. Persistence to Sentry/OTel/DB is wired later.
  return NextResponse.json({ ok: true, enabled: true, mode, accepted: !!report.message }, { status: 200 });
}

export async function GET() {
  const enabled = process.env.LUMORA_ERROR_MONITORING_ENABLED === "1";
  const mode = process.env.LUMORA_ERROR_MONITORING_MODE || "silent";
  return NextResponse.json({ ok: true, enabled, mode }, { status: 200 });
}
