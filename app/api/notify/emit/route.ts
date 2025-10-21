import { NextRequest, NextResponse } from "next/server";
import { emitNotification } from "@/src/lib/notify/store";
import { reqId } from "@/src/lib/reqid";

const DEV = process.env.NODE_ENV !== "production";

export async function POST(req: NextRequest) {
  const id = reqId();
  if (!DEV) return NextResponse.json({ ok:false, error:"DISABLED_IN_PRODUCTION", requestId:id }, { status:200, headers:{ "x-request-id": id } });

  let body: any = {};
  try { body = await req.json(); } catch {}
  const ownerId = typeof body?.ownerId === "string" ? body.ownerId : "";
  const kind = (body?.kind || "").toString().toLowerCase();
  const title = (body?.title || "").toString();
  const msg = typeof body?.body === "string" ? body.body : null;
  const meta = body?.meta;

  const need = [];
  if (!ownerId) need.push("ownerId");
  if (!["low_balance","spend_spike","approval","generic"].includes(kind)) need.push("kind(low_balance|spend_spike|approval|generic)");
  if (!title) need.push("title");
  if (need.length) return NextResponse.json({ ok:false, error:"BAD_REQUEST", need, requestId:id }, { status:200, headers:{ "x-request-id": id } });

  const n = emitNotification(ownerId, kind as any, title, msg, meta);
  return NextResponse.json({ ok:true, notification:n, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
