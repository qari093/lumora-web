import { NextResponse } from "next/server";
import { createUploadPresign } from "@/src/core/uploads-runtime/presign";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.filename) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    presign: createUploadPresign({
      filename: body.filename,
    }),
  });
}
