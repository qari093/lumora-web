import { NextRequest, NextResponse } from "next/server";
import { getWallet, ledgerFor } from "@/src/lib/wallet/mem";
import { reqId } from "@/src/lib/reqid";

export async function GET(req: NextRequest) {
  const id = reqId();
  const u = new URL(req.url);
  const ownerId = u.searchParams.get("ownerId") || "";
  if (!ownerId) {
    return NextResponse.json({ ok:false, error:"MISSING_OWNER", need:["ownerId"], requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  const w = getWallet(ownerId);
  const ledgerCount = ledgerFor(ownerId).length;
  return NextResponse.json({ ok:true, ownerId, euros:w.euros, ledgerCount, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
