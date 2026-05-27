import { NextResponse } from "next/server";
import { buildWeeklyLuminescentDigest } from "@/src/core/email-production/digest";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.userId) {
    return NextResponse.json(
      { ok: false, error: "INVALID_DIGEST_REQUEST" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    digest: buildWeeklyLuminescentDigest({
      userId: body.userId,
      items: Array.isArray(body.items) ? body.items : [],
    }),
  });
}
