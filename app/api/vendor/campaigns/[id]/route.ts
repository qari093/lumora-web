import { NextRequest, NextResponse } from "next/server";
import { getCampaign, patchCampaign, setState } from "@/src/lib/vendor/campaign";
import { reqId } from "@/src/lib/reqid";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = reqId();
  const c = getCampaign(params.id);
  if (!c) return NextResponse.json({ ok:false, error:"NOT_FOUND", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  return NextResponse.json({ ok:true, campaign:c, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = reqId();
  let body:any = {}; try { body = await req.json(); } catch {}
  const action = typeof body?.action === "string" ? body.action.toLowerCase() : "";
  if (action === "pause" || action === "resume" || action === "end") {
    const c = setState(params.id, action as any);
    if (!c) return NextResponse.json({ ok:false, error:"NOT_FOUND", requestId:id }, { status:200, headers:{ "x-request-id": id } });
    return NextResponse.json({ ok:true, campaign:c, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  // patch fields
  const p: any = {};
  if (typeof body?.name === "string") p.name = body.name;
  if (typeof body?.budgetEuros === "number") p.budgetEuros = body.budgetEuros;
  if (typeof body?.startAt === "number" || body?.startAt === null) p.startAt = body.startAt ?? null;
  if (typeof body?.endAt === "number" || body?.endAt === null) p.endAt = body.endAt ?? null;
  const c = patchCampaign(params.id, p);
  if (!c) return NextResponse.json({ ok:false, error:"NOT_FOUND", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  return NextResponse.json({ ok:true, campaign:c, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
