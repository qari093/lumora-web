import { NextResponse } from "next/server";
import { pickLocale } from "../../../lib/locale";
import { getClientIp, geoByIp, currencyFor } from "../../../lib/geo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const locale = pickLocale(req);
    const ip = getClientIp(req);
    const geo = await geoByIp(ip);
    const currency = currencyFor(geo.country);
    return NextResponse.json(
      { ok: true, locale, geo, currency },
      { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=300" } }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
