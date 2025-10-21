import { NextRequest, NextResponse } from "next/server";
import { assignCreative, unassignCreative } from "@/src/lib/vendor/assign";
import { reqId } from "@/src/lib/reqid";

export async function POST(req: NextRequest) {
  const id = reqId();
  let body:any = {}; try { body = await req.json(); } catch {}
  const campaignId = (body?.campaignId || "").toString();
  const creativeId = (body?.creativeId || "").toString();
  const remove = !!body?.remove;

  const need = [];
  if (!campaignId) need.push("campaignId");
  if (!creativeId) need.push("creativeId");
  if (need.length) return NextResponse.json({ ok:false, error:"BAD_REQUEST", need, requestId:id }, { status:200, headers:{ "x-request-id": id } });

  try {
    const res = remove ? unassignCreative(campaignId, creativeId) : assignCreative(campaignId, creativeId);
    return NextResponse.json({ ok:true, assignment: res, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e), requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
}
export const dynamic = "force-dynamic";
