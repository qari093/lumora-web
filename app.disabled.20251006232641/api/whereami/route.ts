import { NextResponse } from "next/server";
import { getClientIP, lookupGeo, labelFromGeo } from "@/src/lib/geo/ip";

export async function GET(req: Request) {
  const ip = getClientIP(req);
  const geo = await lookupGeo(ip);
  return NextResponse.json({
    ok: true,
    ip: geo.ip || ip,
    provider: geo.source,
    geo,
    label: labelFromGeo(geo),
  });
}
