import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ROLES = new Set([
  "admin",
  "moderator",
  "creator",
  "advertiser",
  "user",
  "guest",
]);

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const role =
    typeof payload === "object" &&
    payload !== null &&
    "role" in payload &&
    typeof payload.role === "string"
      ? payload.role.trim().toLowerCase()
      : "";

  if (!ALLOWED_ROLES.has(role)) {
    return NextResponse.json(
      { ok: false, error: "INVALID_ROLE" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true, role });
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set("role", role, {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  response.cookies.set("name", role === "guest" ? "Guest" : "Lumora User", {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  if (role === "guest") {
    response.cookies.set("isCreator", "", {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
