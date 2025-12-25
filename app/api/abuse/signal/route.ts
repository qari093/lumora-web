import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function s(v: unknown, max = 256) {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.length > max ? t.slice(0, max) : t;
}

export async function POST(req: NextRequest) {
  const enabled = process.env.LUMORA_ABUSE_DETECTION_ENABLED === "1";
  const mode = process.env.LUMORA_ABUSE_DETECTION_MODE || "silent";
  if (!enabled) return NextResponse.json({ ok: true, enabled: false }, { status: 200 });

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const signal = {
    ts: s(body?.ts, 64) || new Date().toISOString(),
    type: s(body?.type, 64), // e.g. "spam_click", "rate_burst", "suspicious_ua"
    route: s(body?.route, 200),
    ipHint: s(body?.ipHint, 64), // optional (do not store real IP here yet)
    ua: s(body?.ua, 400),
    note: mode === "silent" ? undefined : body?.note ?? undefined
  };

  // SILENT MODE: acknowledge only; persistence/scoring comes later.
  return NextResponse.json({ ok: true, enabled: true, mode, accepted: !!signal.type }, { status: 200 });
}

export async function GET() {
  const enabled = process.env.LUMORA_ABUSE_DETECTION_ENABLED === "1";
  const mode = process.env.LUMORA_ABUSE_DETECTION_MODE || "silent";
  return NextResponse.json({ ok: true, enabled, mode }, { status: 200 });
}
