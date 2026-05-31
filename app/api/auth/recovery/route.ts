import { NextResponse } from "next/server";

function json(status: number, data: unknown) {
  return NextResponse.json(data, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const channel = typeof body?.channel === "string" ? body.channel.trim() : "email";

    if (!email || !email.includes("@")) {
      return json(400, { ok: false, error: "valid_email_required" });
    }

    return json(200, {
      ok: true,
      status: "accepted",
      channel,
      mode: "contract_ready",
      message: "Recovery request accepted. Guardian recovery can be attached later.",
    });
  } catch {
    return json(500, { ok: false, error: "recovery_failed" });
  }
}
