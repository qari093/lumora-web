import { NextRequest, NextResponse } from "next/server";
import { credit } from "@/src/lib/wallet/mem";
import { reqId } from "@/src/lib/reqid";

const DEV_ENABLED = process.env.NODE_ENV !== "production";

export async function POST(req: NextRequest) {
  const id = reqId();
  if (!DEV_ENABLED) {
    return NextResponse.json({ ok:false, error:"DISABLED_IN_PRODUCTION", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  let body:any = {};
  try { body = await req.json(); } catch {}
  const ownerId = typeof body?.ownerId === "string" ? body.ownerId : "";
  const euros = typeof body?.euros === "number" ? body.euros : NaN;
  const reason = typeof body?.reason === "string" ? body.reason : "manual";

  if (!ownerId || !isFinite(euros)) {
    return NextResponse.json({ ok:false, error:"BAD_REQUEST", need:["ownerId","euros"], requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  try {
    const res = credit(ownerId, euros, reason, id);
    return NextResponse.json({ ok:true, wallet: res.wallet, entry: res.entry, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e), requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
}
export const dynamic = "force-dynamic";
