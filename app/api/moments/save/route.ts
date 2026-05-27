import { NextResponse } from "next/server";
import { saveProductionMoment } from "@/src/core/moments-production/save";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.userId || !body?.creatorId || typeof body?.timestampMs !== "number") {
    return NextResponse.json({ ok: false, error: "INVALID_MOMENT_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    moment: saveProductionMoment({
      userId: body.userId,
      creatorId: body.creatorId,
      postId: body.postId,
      timestampMs: body.timestampMs,
      frameUrl: body.frameUrl,
    }),
  });
}
