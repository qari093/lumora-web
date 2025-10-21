import { NextRequest, NextResponse } from "next/server";
import { listCreatives } from "@/src/lib/creatives/store";
import { reqId } from "@/src/lib/reqid";

export async function GET(req: NextRequest){
  const id = reqId(); const u = new URL(req.url);
  const ownerId = u.searchParams.get("ownerId") || "";
  if(!ownerId) return NextResponse.json({ ok:false, error:"MISSING_OWNER", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  const rows = listCreatives(ownerId);
  return NextResponse.json({ ok:true, ownerId, creatives: rows, count: rows.length, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
