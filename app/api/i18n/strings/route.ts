import { NextResponse } from "next/server";

// Minimal strings provider (server-side), reads cookie \`lang\`
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
  const cookie = req.headers.get("cookie") || "";
  const m = /(?:^|;\s*)lang=([^;]+)/.exec(cookie);
  const v = m ? decodeURIComponent(m[1]) : "en";
  return (v === "ur" ? "ur" : "en");
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
