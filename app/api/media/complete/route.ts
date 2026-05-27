import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.key) {
    return NextResponse.json({ ok: false, error: "MISSING_MEDIA_KEY" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    media: {
      key: body.key,
      status: "completed",
    },
  });
}
