import { NextRequest, NextResponse } from "next/server";
import { parseLatLon } from "@/src/lib/geo/core";
import { reqId } from "@/src/lib/reqid";

function ip(req: NextRequest){ const xf=req.headers.get("x-forwarded-for"); if (xf) return xf.split(",")[0].trim(); return req.headers.get("x-real-ip")?.trim() || "0.0.0.0"; }

export async function GET(req: NextRequest) {
  const id = reqId();
  const who = ip(req);
  const FAKE = process.env.GEO_IP_FAKE || ""; // e.g. "51.5074,-0.1278" (London)
  if (!FAKE) {
    return NextResponse.json({
      ok:false,
      disabled:true,
      error:"GEO_IP_DISABLED",
      message:"Set GEO_IP_FAKE=\"lat,lon\" in .env.local for dev testing (no external lookups).",
      requestId:id
    }, { status:200, headers:{ "x-request-id": id } });
  }
  const parts = FAKE.split(",").map(s=>s.trim());
  const p = parseLatLon(parts[0], parts[1]);
  if (!p) {
    return NextResponse.json({ ok:false, error:"BAD_GEO_IP_FAKE", value:FAKE, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  return NextResponse.json({ ok:true, ip:who, coarse:p, source:"env:fake", requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
