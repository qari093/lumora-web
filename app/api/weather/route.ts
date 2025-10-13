import { NextResponse } from "next/server";
import { pickLocale, fmtDateISO } from "../../../lib/locale";
import { getClientIp, geoByIp } from "../../../lib/geo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const WX_LABEL: Record<number, Record<string, string>> = {
  0:  { en: "Clear", ur: "کھلا آسمان", hi: "साफ", ar: "صاف", es: "Despejado" },
  1:  { en: "Mainly clear", ur: "زیادہ تر صاف", hi: "अधिकांश साफ" },
  2:  { en: "Partly cloudy", ur: "جزوی ابر آلود", hi: "आंशिक बादल", ar:"غائم جزئياً" },
  3:  { en: "Overcast", ur: "ابر آلود", hi: "घना बादल", ar:"غائم" },
  45: { en: "Fog", ur: "کہر", es: "Niebla" },
  48: { en: "Depositing rime fog", ur: "برفانی کہر" },
  51: { en: "Light drizzle", ur: "ہلکی پھوار" },
  53: { en: "Drizzle", ur: "پھوار" },
  55: { en: "Heavy drizzle", ur: "تیز پھوار" },
  61: { en: "Light rain", ur: "ہلکی بارش" },
  63: { en: "Rain", ur: "بارش" },
  65: { en: "Heavy rain", ur: "تیز بارش" },
  71: { en: "Light snow", ur: "ہلکی برفباری" },
  73: { en: "Snow", ur: "برفباری" },
  75: { en: "Heavy snow", ur: "تیز برفباری" },
  80: { en: "Rain showers", ur: "بارش کی جھڑیاں" },
  95: { en: "Thunderstorm", ur: "گرج چمک" }
};

function wxText(code: number | undefined, lang: string): string {
  if (code == null) return "";
  const base = lang.split("-")[0];
  return WX_LABEL[code]?.[lang] || WX_LABEL[code]?.[base] || WX_LABEL[code]?.en || String(code);
}

async function fetchWeather(lat: number, lon: number) {
  const qs = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "wind_speed_10m",
      "weather_code"
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation",
      "relative_humidity_2m",
      "weather_code"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum"
    ].join(","),
    timezone: "auto"
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("weather fetch failed");
  return res.json();
}

export async function GET(req: Request) {
  try {
    const locale = pickLocale(req);
    const ip = getClientIp(req);
    const geo = await geoByIp(ip);
    const wx = await fetchWeather(geo.lat, geo.lon);

    const currentCode = Number(wx.current?.weather_code ?? NaN);
    const current = {
      ...wx.current,
      text: Number.isFinite(currentCode) ? wxText(currentCode, locale.lang) : ""
    };

    const hourly = (wx.hourly?.time || []).slice(0, 24).map((t: string, i: number) => ({
      timeISO: t,
      time: fmtDateISO(t, locale.lang, { timeStyle: "short", dateStyle: undefined }),
      tempC: wx.hourly?.temperature_2m?.[i],
      rh: wx.hourly?.relative_humidity_2m?.[i],
      precipMM: wx.hourly?.precipitation?.[i],
      code: wx.hourly?.weather_code?.[i],
      text: wxText(wx.hourly?.weather_code?.[i], locale.lang)
    }));

    return NextResponse.json(
      {
        ok: true,
        where: { city: geo.city, region: geo.region, country: geo.country, lat: geo.lat, lon: geo.lon },
        locale,
        current,
        hourly,
        daily: wx.daily
      },
      { headers: { "Cache-Control": "private, max-age=120, stale-while-revalidate=600" } }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
