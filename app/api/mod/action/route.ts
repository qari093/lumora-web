import { NextRequest, NextResponse } from "next/server";
import { resolveReport, ReportStatus } from "@/src/lib/mod/store";
import { modKeyOk } from "@/src/lib/mod/auth";
import { reqId } from "@/src/lib/reqid";

type Action = "approve" | "reject" | "ban" | "unban";
const map: Record<Action, Exclude<ReportStatus,"open">> = {
  approve: "approved",
  reject: "rejected",
  ban: "banned",
  unban: "unbanned",
};

export async function POST(req: NextRequest) {
  const id = reqId();
  const auth = modKeyOk(req);
  if (!auth.ok) return NextResponse.json({ ok:false, error:"UNAUTHORIZED", requestId:id }, { status: 401, headers:{ "x-request-id": id } });

  let body:any = {};
  try { body = await req.json(); } catch {}

  const repId = (body?.id || "").toString();
  const action = (body?.action || "").toString().toLowerCase() as Action;
  const note = (body?.note || "").toString();

  const need = [];
  if (!repId) need.push("id");
  if (!map[action]) need.push("action(approve|reject|ban|unban)");
  if (need.length) {
    return NextResponse.json({ ok:false, error:"BAD_REQUEST", need, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  const saved = resolveReport(repId, map[action], auth.who || "admin", note);
  if (!saved) {
    return NextResponse.json({ ok:false, error:"NOT_FOUND", id:repId, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
  return NextResponse.json({ ok:true, report: saved, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
