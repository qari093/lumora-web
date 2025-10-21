import { NextRequest, NextResponse } from "next/server";
import { getCreative, updateCreative } from "@/src/lib/creatives/store";
import { isSafeImageUrl, isSafeActionUrl } from "@/src/lib/creatives/validate";
import { reqId } from "@/src/lib/reqid";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }){
  const id = reqId(); let body:any={}; try{ body = await req.json(); }catch{}
  const cur = getCreative(params.id);
  if(!cur) return NextResponse.json({ ok:false, error:"NOT_FOUND", requestId:id }, { status:200, headers:{ "x-request-id": id } });

  if (typeof body?.image === "string") {
    const iv = isSafeImageUrl(body.image);
    if(!iv.ok) return NextResponse.json({ ok:false, error:"BAD_IMAGE_URL", reason: iv.reason, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  if (typeof body?.actionUrl === "string") {
    const av = isSafeActionUrl(body.actionUrl);
    if(!av.ok) return NextResponse.json({ ok:false, error:"BAD_ACTION_URL", reason: av.reason, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  const c = updateCreative(params.id, {
    title: typeof body?.title === "string" ? body.title : undefined,
    image: typeof body?.image === "string" ? body.image : undefined,
    actionUrl: typeof body?.actionUrl === "string" ? body.actionUrl : undefined,
  });
  if(!c) return NextResponse.json({ ok:false, error:"NOT_FOUND", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  return NextResponse.json({ ok:true, creative:c, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
