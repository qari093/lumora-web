import { NextResponse } from "next/server";

// POST /api/i18n/set
// Body: { lang: "en" | "ur" } → sets cookie \`lang\` for 1 year
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
    const lang = supported.has(raw) ? (raw as "en" | "ur") : "en";

    const res = NextResponse.json({ ok: true, lang });
    // 365 days; SameSite=Lax; Path=/ for SSR + client
    const maxAge = 60 * 60 * 24 * 365;
    res.headers.append(
      "Set-Cookie",
      \`lang=\${encodeURIComponent(lang)}; Path=/; Max-Age=\${maxAge}; SameSite=Lax\`
    );
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}

// Optional GET for manual testing (?lang=en|ur)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("lang") || "").toLowerCase();
    const supported = new Set(["en", "ur"]);
    const lang = (supported.has(q) ? q : "en") as "en" | "ur";
    const res = NextResponse.json({ ok: true, lang, via: "GET" });
    const maxAge = 60 * 60 * 24 * 365;
    res.headers.append(
      "Set-Cookie",
      \`lang=\${encodeURIComponent(lang)}; Path=/; Max-Age=\${maxAge}; SameSite=Lax\`
    );
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
