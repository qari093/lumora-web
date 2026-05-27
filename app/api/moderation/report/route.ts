import { NextResponse } from "next/server";
import { createModerationReport } from "@/src/core/moderation-production/report";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.reporterId || !body?.targetId || !body?.category) {
    return NextResponse.json({ ok: false, error: "INVALID_REPORT_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, report: createModerationReport(body) });
}
