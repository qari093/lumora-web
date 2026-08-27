import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {

  const enabled =
    process.env.VIBE_TAGS_LITE_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_VIBE_TAGS_LITE_ENABLED === "true";

  if (!enabled) {
    return NextResponse.json({
      ok: true,
      enabled: false,
      items: [],
      source: "flags:vibeTagsLiteEnabled",
      ts: Date.now()
    });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const requestedLimit = Number(
    url.searchParams.get("limit") || "20"
  );
  const limit = Math.max(
    1,
    Math.min(
      100,
      Number.isFinite(requestedLimit)
        ? Math.trunc(requestedLimit)
        : 20
    )
  );

  if (!userId) {
    return NextResponse.json({
      ok: false,
      error: "userId_required"
    }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    enabled: true,
    items: [],
    limit,
    ts: Date.now()
  });
}
