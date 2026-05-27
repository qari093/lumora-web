import { NextResponse } from "next/server";
import { unfollowCreator } from "@/src/core/fan-production/unfollow";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.userId || !body?.creatorId) {
    return NextResponse.json({ ok: false, error: "INVALID_UNFOLLOW_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, result: unfollowCreator(body) });
}
