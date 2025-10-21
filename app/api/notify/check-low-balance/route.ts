import { NextRequest, NextResponse } from "next/server";
import { getLowBalanceThreshold, emitNotification } from "@/src/lib/notify/store";
import { getWallet } from "@/src/lib/wallet/mem";
import { reqId } from "@/src/lib/reqid";

export async function POST(req: NextRequest) {
  const id = reqId();
  let body:any = {};
  try { body = await req.json(); } catch {}
  const ownerId = typeof body?.ownerId === "string" ? body.ownerId : "";

  if (!ownerId) return NextResponse.json({ ok:false, error:"BAD_REQUEST", need:["ownerId"], requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const threshold = getLowBalanceThreshold(ownerId);
  if (threshold === null) {
    return NextResponse.json({ ok:true, emitted:false, reason:"NO_SUBSCRIPTION", threshold: null, balance: getWallet(ownerId).euros, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  const bal = getWallet(ownerId).euros;
  if (bal < threshold) {
    const title = `Low balance: €${bal.toFixed(2)} (< €${threshold.toFixed(2)})`;
    const note = emitNotification(ownerId, "low_balance", title, "Top up to keep campaigns running", { balance: bal, threshold });
    return NextResponse.json({ ok:true, emitted:true, notification: note, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  return NextResponse.json({ ok:true, emitted:false, reason:"ABOVE_THRESHOLD", threshold, balance: bal, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
