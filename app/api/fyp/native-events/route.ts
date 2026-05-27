import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.type !== "string" || typeof body.id !== "string") {
    return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
