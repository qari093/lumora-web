import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const enabled =
    process.env.VIBE_TAGS_LITE_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_VIBE_TAGS_LITE_ENABLED === "true";

  if (!enabled) {
    return NextResponse.json({
      ok: true,
      enabled: false,
      source: "flags:vibeTagsLiteEnabled",
      items: [],
      ts: Date.now()
    });
  }

  return NextResponse.json({
    ok: true,
    enabled: true,
    items: [],
    ts: Date.now()
  });
}
