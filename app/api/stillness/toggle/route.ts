import { NextResponse } from "next/server";
import { toggleSeasonOfStillness } from "@/src/core/stillness-production/toggle";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.creatorId || typeof body?.enabled !== "boolean") {
    return NextResponse.json({ ok: false, error: "INVALID_STILLNESS_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, result: toggleSeasonOfStillness(body) });
}
