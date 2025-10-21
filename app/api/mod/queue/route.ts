import { NextRequest, NextResponse } from "next/server";
import { listReports, ReportStatus } from "@/src/lib/mod/store";
import { modKeyOk } from "@/src/lib/mod/auth";
import { reqId } from "@/src/lib/reqid";

export async function GET(req: NextRequest) {
  const id = reqId();
  const auth = modKeyOk(req);
  if (!auth.ok) return NextResponse.json({ ok:false, error:"UNAUTHORIZED", requestId:id }, { status: 401, headers:{ "x-request-id": id } });

  const u = new URL(req.url);
  const statusStr = u.searchParams.getAll("status");
  const statuses = (statusStr.length ? statusStr : ["open"]).map(s=>s.toLowerCase()) as ReportStatus[];
  const rows = listReports(statuses);
  return NextResponse.json({ ok:true, rows, requestId:id }, { status:200, headers:{ "x-request-id": id } });
}
export const dynamic = "force-dynamic";
