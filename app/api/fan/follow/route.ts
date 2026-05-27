import { NextResponse } from "next/server";
import { followCreator } from "@/src/core/fan-production/follow";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.userId || !body?.creatorId) {
    return NextResponse.json({ ok: false, error: "INVALID_FOLLOW_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, result: followCreator(body) });
}
