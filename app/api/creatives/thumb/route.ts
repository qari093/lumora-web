import { NextRequest, NextResponse } from "next/server";
import { isSafeImageUrl } from "@/src/lib/creatives/validate";
import { reqId } from "@/src/lib/reqid";

export async function GET(req: NextRequest){
  const id = reqId();
  const u = new URL(req.url);
  const url = u.searchParams.get("url") || "";
  const v = isSafeImageUrl(url);
  if(!v.ok) return NextResponse.json({ ok:false, error:"BAD_IMAGE_URL", reason:v.reason, requestId:id }, { status:200, headers:{ "x-request-id": id } });

  // Local /static proxy via internal fetch
  if (v.local) {
    try{
      const abs = new URL(url, u.origin);
      const res = await fetch(abs, { cache: "no-store" });
      if (!res.ok) return NextResponse.json({ ok:false, error:"NOT_FOUND", status: res.status, requestId:id }, { status:200, headers:{ "x-request-id": id } });
      const ct = res.headers.get("content-type") || "application/octet-stream";
      const buf = await res.arrayBuffer();
      return new NextResponse(Buffer.from(buf), { status:200, headers: { "content-type": ct, "x-request-id": id }});
    }catch(e:any){
      return NextResponse.json({ ok:false, error:"FETCH_ERROR", message:String(e?.message||e), requestId:id }, { status:200, headers:{ "x-request-id": id } });
    }
  }

  // External disabled unless explicitly allowed
  if (process.env.ALLOW_THUMB_PROXY === "1") {
    try{
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return NextResponse.json({ ok:false, error:"UPSTREAM", status: res.status, requestId:id }, { status:200, headers:{ "x-request-id": id } });
      const ct = res.headers.get("content-type") || "application/octet-stream";
      const buf = await res.arrayBuffer();
      return new NextResponse(Buffer.from(buf), { status:200, headers: { "content-type": ct, "x-request-id": id }});
    }catch(e:any){
      return NextResponse.json({ ok:false, error:"FETCH_ERROR", message:String(e?.message||e), requestId:id }, { status:200, headers:{ "x-request-id": id } });
    }
  }
  return NextResponse.json({ ok:false, disabled:true, error:"EXTERNAL_PROXY_DISABLED", need:["ALLOW_THUMB_PROXY=1"], requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
