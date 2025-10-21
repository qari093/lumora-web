import { NextResponse } from "next/server";
import { z } from "zod";
import { newsQueue } from "@/lib/queue";
import { guardContent } from "@/lib/guardian";
import { getClientIP, lookupGeo, labelFromGeo } from "@/lib/geo/ip";

const Body = z.object({
  title: z.string().min(4),
  text: z.string().min(10),
  source: z.string().min(2),
  sourceUrl: z.string().url(),
  lang: z.enum(["EN","UR","DE","AR","HI","ES","FR","IT","TR"]).default("EN"),
  publishedAt: z.string().datetime({ offset:true }).optional()
});

export async function POST(req: Request) {
  try {
    const ip = getClientIP(req);
    const geo = await lookupGeo(ip);
    const data = Body.parse(await req.json());

    const verdict = await guardContent({
      title: data.title, text: data.text, source: data.source, sourceUrl: data.sourceUrl
    });
    if (!verdict.publish) {
      return NextResponse.json({ ok:false, gated:true, verdict, geo }, { status: 422 });
    }

    const job = await newsQueue().add("news-item", {
      category: "news",
      ...data,
      locality: {
        label: labelFromGeo(geo),
        city: geo.city, region: geo.region, country: geo.country, countryCode: geo.countryCode,
        lat: geo.lat, lon: geo.lon
      }
    }, { removeOnComplete: { count: 100 }, removeOnFail: { count: 50 }, attempts: 1 });

    return NextResponse.json({ ok:true, id: job.id, accepted:true, geoProvider: geo.source, locality: labelFromGeo(geo) });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || "invalid" }, { status: 400 });
  }
}
