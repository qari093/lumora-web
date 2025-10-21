import { NextRequest, NextResponse } from "next/server";
import { upsertSubscription } from "@/src/lib/notify/store";
import { reqId } from "@/src/lib/reqid";

export async function POST(req: NextRequest) {
  const id = reqId();
  let body: any = {};
  try { body = await req.json(); } catch {}
  const ownerId = typeof body?.ownerId === "string" ? body.ownerId : "";
  const kind = (body?.kind || "").toString().toLowerCase();
  const threshold = typeof body?.thresholdEuros === "number" ? body.thresholdEuros : null;

  const need = [];
  if (!ownerId) need.push("ownerId");
  if (!["low_balance","spend_spike","approval","generic"].includes(kind)) need.push("kind(low_balance|spend_spike|approval|generic)");
  if (need.length) return NextResponse.json({ ok:false, error:"BAD_REQUEST", need, requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const sub = upsertSubscription(ownerId, kind as any, threshold);
  return NextResponse.json({ ok:true, subscription: sub, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
