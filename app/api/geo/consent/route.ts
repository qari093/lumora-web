import { NextRequest, NextResponse } from "next/server";
import { setConsent, getConsent } from "@/src/lib/geo/core";
import { reqId } from "@/src/lib/reqid";

function ip(req: NextRequest){ const xf=req.headers.get("x-forwarded-for"); if (xf) return xf.split(",")[0].trim(); return req.headers.get("x-real-ip")?.trim() || "0.0.0.0"; }

export async function POST(req: NextRequest) {
  const id = reqId();
  let body:any = {};
  try { body = await req.json(); } catch {}
  const grant = !!body?.grant;
  const who = ip(req);
  setConsent(who, grant ? "granted" : "denied");
  const now = getConsent(who);
  return NextResponse.json({ ok:true, ip:who, consent: now, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}

export async function GET(req: NextRequest) {
  const id = reqId();
  const who = ip(req);
  return NextResponse.json({ ok:true, ip:who, consent: getConsent(who) || null, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
