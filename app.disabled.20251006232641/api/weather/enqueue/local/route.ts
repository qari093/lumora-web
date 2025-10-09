import { NextResponse } from "next/server";
import { z } from "zod";
import { weatherQueue } from "@/src/lib/queue";
import { getClientIP, lookupGeo, labelFromGeo } from "@/src/lib/geo/ip";

const Query = z.object({
  units: z.enum(["metric","imperial"]).default("metric"),
  provider: z.enum(["open-meteo","owm"]).default("open-meteo")
});

export async function POST(req: Request) {
  try {
    const ip = getClientIP(req);
    const geo = await lookupGeo(ip);
    const params = Query.parse(Object.fromEntries(new URL(req.url).searchParams));
    const location = labelFromGeo(geo) || "Unknown";
    const job = await weatherQueue().add("weather-local", {
      category: "weather",
      location,
      units: params.units,
      provider: params.provider,
      lat: geo.lat,
      lon: geo.lon
    }, { removeOnComplete: { count: 100 }, removeOnFail: { count: 50 }, attempts: 1 });
    return NextResponse.json({ ok: true, id: job.id, location, geoProvider: geo.source });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || "invalid" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
