import { NextRequest, NextResponse } from "next/server";
import { createReport, ReportKind } from "@/src/lib/mod/store";
import { reqId } from "@/src/lib/reqid";

export async function POST(req: NextRequest) {
  const id = reqId();
  let body:any = {};
  try { body = await req.json(); } catch {}

  const kind = (body?.kind || "").toString().toLowerCase() as ReportKind;
  const targetId = (body?.targetId || "").toString();
  const reason = (body?.reason || "").toString();
  const meta = body?.meta;

  const allowedKinds = new Set<ReportKind>(["content","user","ad"]);
  const missing = [];
  if (!allowedKinds.has(kind)) missing.push("kind(content|user|ad)");
  if (!targetId) missing.push("targetId");
  if (!reason) missing.push("reason");

  if (missing.length) {
    return NextResponse.json({ ok:false, error:"BAD_REQUEST", need:missing, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  const r = createReport(kind, targetId, reason, meta);
  return NextResponse.json({ ok:true, report:r, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
