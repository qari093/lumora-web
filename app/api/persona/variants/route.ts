import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMOTIONS = ["neutral", "happy", "sad", "angry", "surprised", "focused", "calm"] as const;
type Emotion = (typeof EMOTIONS)[number];

function safeCode(code: string | null): string | null {
  if (!code) return null;
  // avatar_001..avatar_120
  if (!/^avatar_\d{3}$/.test(code)) return null;
  const n = Number(code.slice(-3));
  if (!Number.isFinite(n) || n < 1 || n > 120) return null;
  return code;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = safeCode(url.searchParams.get("code"));
  if (!code) {
    return NextResponse.json(
      { ok: false, error: "BAD_CODE", message: "code must be avatar_001..avatar_120" },
      { status: 400 }
    );
  }

  const out: Record<string, string> = {};
  for (const e of EMOTIONS) out[e] = `/persona/avatars/${e}/${code}.svg`;

  return NextResponse.json({ ok: true, code, variants: out });
}
