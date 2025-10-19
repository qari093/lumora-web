import { NextResponse } from "next/server";

// Minimal strings provider (server-side), reads cookie `lang`
const STRINGS: Record<string, Record<string, string>> = {
  en: {
    brand_insights: "Brand Insights",
    vendor_dashboard: "Vendor Dashboard",
    admin_panel: "Admin Panel",
  },
  ur: {
    brand_insights: "برانڈ انسائٹس",
    vendor_dashboard: "وینڈر ڈیش بورڈ",
    admin_panel: "ایڈمن پینل",
  },
};

function getLangFromCookie(req: Request): "en" | "ur" {
  const header = req.headers.get("cookie") || "";
  // prefer the LAST occurrence of `lang=...`
  let found: string | null = null;
  for (const part of header.split(/; */)) {
    const eq = part.indexOf("=");
    if (eq <= 0) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1);
    if (k === "lang") found = decodeURIComponent(v);
  }
  const lang = (found === "ur" ? "ur" : "en") as "en" | "ur";
  return lang;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ns = url.searchParams.get("ns") || "common";
    const lang = getLangFromCookie(req);
    const strings = STRINGS[lang] || STRINGS.en;
    return NextResponse.json({ ok: true, lang, ns, strings });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
