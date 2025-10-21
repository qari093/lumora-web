import { NextRequest, NextResponse } from "next/server";
import { listInbox, listSubscriptions } from "@/src/lib/notify/store";
import { reqId } from "@/src/lib/reqid";

export async function GET(req: NextRequest) {
  const id = reqId();
  const u = new URL(req.url);
  const ownerId = u.searchParams.get("ownerId") || "";
  const limit = Math.max(1, Math.min(200, Number(u.searchParams.get("limit") || "50")));

  if (!ownerId) return NextResponse.json({ ok:false, error:"MISSING_OWNER", requestId:id }, { status:200, headers:{ "x-request-id": id } });

  return NextResponse.json({
    ok:true,
    ownerId,
    subs: listSubscriptions(ownerId),
    inbox: listInbox(ownerId, limit),
    requestId:id
  }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
