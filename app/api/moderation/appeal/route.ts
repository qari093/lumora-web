import { NextResponse } from "next/server";
import { createModerationAppeal } from "@/src/core/moderation-production/appeal";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.reportId || !body?.userId || !body?.reason) {
    return NextResponse.json({ ok: false, error: "INVALID_APPEAL_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, appeal: createModerationAppeal(body) });
}
