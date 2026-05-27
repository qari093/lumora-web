import { NextResponse } from "next/server";
import { optIntoSafetyCircle } from "@/src/core/safety-circle-production/opt-in";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.creatorId || typeof body?.contributionBps !== "number") {
    return NextResponse.json({ ok: false, error: "INVALID_SAFETY_CIRCLE_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, result: optIntoSafetyCircle(body) });
}
