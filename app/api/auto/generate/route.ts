import { NextResponse } from "next/server";
import { addGenerated } from "../../fyp/_store";
import { pickLocale } from "../../../../lib/locale";
import { getClientIp, geoByIp, currencyFor } from "../../../../lib/geo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function safeJson(url: string) {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const locale = pickLocale(req);
    const ip = getClientIp(req);
    const geo = await geoByIp(ip);
    const hl = locale.lang;
    const gl = geo.country || "US";
    const ccy = currencyFor(gl);

    // Pull quick context (weather, news, finance)
    const [wx, news, fin] = await Promise.all([
      safeJson(`${new URL(req.url).origin}/api/weather`),
      safeJson(`${new URL(req.url).origin}/api/news`),
      safeJson(`${new URL(req.url).origin}/api/finance?symbols=AAPL,MSFT,GOOG`)
    ]);

    const city = geo.city ? `${geo.city}, ${gl}` : gl;
    const temp = Math.round(wx?.current?.temperature_2m ?? NaN);
    const wxText = wx?.current?.text || "";
    const headline = news?.items?.[0]?.title || "Top headline";
    const fin1 = fin?.quotes?.[0]?.symbol
      ? `${fin.quotes[0].symbol} ${fin.quotes[0].close ?? ""}`
      : `${ccy} markets`;

    const parts: string[] = [];
    parts.push("AI Generated");
    if (Number.isFinite(temp)) parts.push(`${temp}°C`);
    if (wxText) parts.push(wxText);
    parts.push(city);
    parts.push("•");
    parts.push(headline);
    parts.push("•");
    parts.push(fin1);

    const title = parts.join(" — ");

    const clip = addGenerated(title);
    return NextResponse.json({ ok: true, clip, locale, geo });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// Allow GET for manual test
export async function GET(req: Request) {
  return POST(req);
}
