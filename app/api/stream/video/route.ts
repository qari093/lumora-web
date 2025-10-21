import { NextRequest, NextResponse } from "next/server";
import { getVideo, stats } from "@/src/lib/stream/store";
import { reqId } from "@/src/lib/reqid";

export async function GET(req: NextRequest) {
  const id = reqId();
  const u = new URL(req.url);
  const vid = u.searchParams.get("id") || "";
  if (!vid) {
    return NextResponse.json({ ok:false, error:"MISSING_ID", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  const rec = getVideo(vid);
  if (!rec) {
    return NextResponse.json({ ok:true, found:false, stats: stats(), requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  return NextResponse.json({ ok:true, found:true, video: rec, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
