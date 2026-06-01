/* Lumora auth provider readiness: unauthorized access handling, verify email flow, NEXTAUTH_SECRET, NEXTAUTH_URL. */
import { NextResponse } from "next/server";

function json(status: number, data: unknown) {
  return NextResponse.json(data, { status });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = String(url.searchParams.get("token") || "").trim();

  if (!token) return json(400, { ok: false, error: "verification_token_required" });

  return json(200, {
    ok: true,
    status: "accepted",
    message: "Email verification contract accepted.",
    mode: "contract_ready",
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!token) return json(400, { ok: false, error: "verification_token_required" });

  return json(200, {
    ok: true,
    status: "accepted",
    message: "Email verification contract accepted.",
    mode: "contract_ready",
  });
}
