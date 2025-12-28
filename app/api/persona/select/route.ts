import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidCode(code: string) {
  return /^avatar_\d{3}$/.test(code);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body?.code || "").trim();
    if (!isValidCode(code)) {
      return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true, code }, { status: 200 });
    // 6 months, httpOnly so server components can read it; client writes via POST
    res.cookies.set("persona_code", code, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "select_failed", detail: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET() {
  // light health probe / CORS-safe
  return NextResponse.json({ ok: true }, { status: 200 });
}
