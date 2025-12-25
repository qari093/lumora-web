import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const enabled = process.env.LUMORA_PRIVATE_ACCESS_ENABLED === "1";
  if (!enabled) {
    return NextResponse.json({ ok: true, enabled: false, message: "Private access disabled." }, { status: 200 });
  }

  const token = process.env.LUMORA_PRIVATE_ACCESS_TOKEN || "";
  const cookieName = process.env.LUMORA_PRIVATE_ACCESS_COOKIE || "lumora_private_access";

  const url = new URL(req.url);
  const provided = url.searchParams.get("token") || "";

  if (!token) {
    return NextResponse.json({ ok: false, error: "Server token not configured." }, { status: 500 });
  }

  if (!provided || provided !== token) {
    return NextResponse.json({ ok: false, error: "Invalid token." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, enabled: true }, { status: 200 });
  res.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  return res;
}
