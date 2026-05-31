import { NextResponse } from "next/server";

function json(status: number, data: unknown) {
  return NextResponse.json(data, { status });
}

export async function GET() {
  return json(200, {
    ok: true,
    sessions: [],
    mode: "contract_ready",
    note: "Real session/device inventory must be wired to the production auth provider.",
  });
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";

  if (!sessionId) return json(400, { ok: false, error: "session_id_required" });

  return json(200, {
    ok: true,
    revoked: true,
    sessionId,
    mode: "contract_ready",
  });
}
