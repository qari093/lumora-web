import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function clampStr(v: unknown, max = 256) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(req: NextRequest) {
  const enabled = process.env.LUMORA_TELEMETRY_ENABLED === "1";
  const mode = process.env.LUMORA_TELEMETRY_MODE || "silent";
  if (!enabled) return NextResponse.json({ ok: true, enabled: false }, { status: 200 });

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Minimal schema; never throw
  const event = {
    name: clampStr(body?.name, 80),
    ts: clampStr(body?.ts, 64) || new Date().toISOString(),
    page: clampStr(body?.page, 200),
    kind: clampStr(body?.kind, 80),
    // keep payload small in silent mode
    meta: mode === "silent" ? undefined : body?.meta ?? undefined
  };

  // SILENT MODE: Do not log, do not persist (yet). Just ack.
  // Later steps can wire persistence to DB/OTel/ingest pipelines.
  return NextResponse.json({ ok: true, enabled: true, mode, accepted: !!event.name }, { status: 200 });
}

export async function GET() {
  const enabled = process.env.LUMORA_TELEMETRY_ENABLED === "1";
  const mode = process.env.LUMORA_TELEMETRY_MODE || "silent";
  return NextResponse.json({ ok: true, enabled, mode }, { status: 200 });
}
