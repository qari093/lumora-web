import { NextResponse } from "next/server";
import { createTeaserAsset } from "@/src/core/teaser-runtime/create";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.sourceId || !body?.platform) {
    return NextResponse.json({ ok: false, error: "INVALID_TEASER_REQUEST" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    teaser: createTeaserAsset({
      sourceId: body.sourceId,
      platform: body.platform,
    }),
  });
}
