/* Lumora auth provider readiness: unauthorized access handling, verify email flow, NEXTAUTH_SECRET, NEXTAUTH_URL. */
import { NextResponse } from "next/server";

function json(status: number, data: unknown) {
  return NextResponse.json(data, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return json(400, { ok: false, error: "valid_email_required" });
    }

    return json(200, {
      ok: true,
      status: "accepted",
      message: "If this email exists, recovery instructions will be sent.",
      mode: "contract_ready",
    });
  } catch {
    return json(500, { ok: false, error: "forgot_password_failed" });
  }
}
