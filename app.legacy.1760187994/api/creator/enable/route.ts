import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.json({ ok: true, mode: "creator-enabled" });
  res.cookies.set("isCreator", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}
