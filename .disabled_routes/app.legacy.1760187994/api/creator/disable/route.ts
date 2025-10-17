import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.json({ ok: true, mode: "creator-disabled" });
  res.cookies.set("isCreator", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
