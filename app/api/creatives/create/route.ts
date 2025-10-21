import { NextRequest, NextResponse } from "next/server";
import { createCreative } from "@/src/lib/creatives/store";
import { isSafeImageUrl, isSafeActionUrl } from "@/src/lib/creatives/validate";
import { reqId } from "@/src/lib/reqid";

export async function POST(req: NextRequest){
  const id = reqId(); let body:any={}; try{ body = await req.json(); }catch{}
  const ownerId = (body?.ownerId||"").toString().trim();
  const title = (body?.title||"").toString().trim();
  const image = (body?.image||"").toString().trim();
  const actionUrl = (body?.actionUrl||"").toString().trim();

  const need:string[] = [];
  if(!ownerId) need.push("ownerId");
  if(!title) need.push("title");
  if(!image) need.push("image");
  if(!actionUrl) need.push("actionUrl");
  if(need.length) return NextResponse.json({ ok:false, error:"BAD_REQUEST", need, requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const iv = isSafeImageUrl(image);
  if(!iv.ok) return NextResponse.json({ ok:false, error:"BAD_IMAGE_URL", reason: iv.reason, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  const av = isSafeActionUrl(actionUrl);
  if(!av.ok) return NextResponse.json({ ok:false, error:"BAD_ACTION_URL", reason: av.reason, requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const c = createCreative({ ownerId, title, image, actionUrl });
  return NextResponse.json({ ok:true, creative:c, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
