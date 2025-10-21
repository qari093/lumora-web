import { NextRequest, NextResponse } from "next/server";
import { recordHit, metricsSnapshot } from "@/src/lib/ads/track";
import { getCreativeById } from "@/src/lib/ads/fixtures";
import { charge } from "@/src/lib/ads/spend";
import { reqId } from "@/src/lib/reqid";

function ip(req: NextRequest){ const xf=req.headers.get("x-forwarded-for"); if(xf) return xf.split(",")[0].trim(); return req.headers.get("x-real-ip")?.trim() || "0.0.0.0"; }

export async function GET(req: NextRequest){
  const id = reqId();
  const u = new URL(req.url);
  const cid = u.searchParams.get("cid") || "";
  const rid = u.searchParams.get("rid") || "";
  const userAgent = req.headers.get("user-agent") || "";

  if (!cid || !rid) {
    return NextResponse.json({ ok:false, error:"MISSING_PARAMS", need:[!cid?"cid":null,!rid?"rid":null].filter(Boolean), requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  const { deduped, rec } = recordHit({ type:"imp", cid, rid, ip: ip(req), ua: userAgent });
  let spend:any = null;
  const creative = getCreativeById(cid);
  if (creative && !deduped) {
    spend = { kind:"imp", ...(charge(creative.ownerId, "imp", id)) };
  }

  const snap = metricsSnapshot();
  return NextResponse.json({ ok:true, type:"imp", deduped, record: rec, spend, totals: snap, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}

export const dynamic = "force-dynamic";
