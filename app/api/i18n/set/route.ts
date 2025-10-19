import { NextResponse } from "next/server";

/**
 * POST /api/i18n/set
 * Body: { lang: "en" | "ur" }
 * Sets cookie `lang` for 1 year using NextResponse.cookies (driver-safe).
 */
export async function POST(req: Request) {
  try {
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {
      payload = {};
    }

    const raw = (payload?.lang ?? "").toString().toLowerCase();
    const supported = new Set(["en", "ur"]);
    const lang = (supported.has(raw) ? raw : "en") as "en" | "ur";

    const res = NextResponse.json({ ok: true, lang });
    // use cookies API instead of manually appending header (prevents edge/driver quirks)
    res.cookies.set({
      name: "lang",
      value: lang,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

/** GET helper: /api/i18n/set?lang=en|ur (handy for quick browser tests) */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("lang") || "").toLowerCase();
    const supported = new Set(["en", "ur"]);
    const lang = (supported.has(q) ? q : "en") as "en" | "ur";
    const res = NextResponse.json({ ok: true, lang, via: "GET" });
    res.cookies.set({
      name: "lang",
      value: lang,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
