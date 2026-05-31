import { NextResponse } from "next/server";

function json(status: number, data: unknown) {
  return NextResponse.json(data, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!token) return json(400, { ok: false, error: "reset_token_required" });
    if (password.length < 10) return json(400, { ok: false, error: "password_min_10_chars" });

    return json(200, {
      ok: true,
      status: "accepted",
      message: "Password reset contract accepted.",
      mode: "contract_ready",
    });
  } catch {
    return json(500, { ok: false, error: "reset_password_failed" });
  }
}
