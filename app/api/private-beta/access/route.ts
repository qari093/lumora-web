import { NextResponse } from "next/server";

type AccessBody = {
  email?: string;
  inviteCode?: string;
  testerId?: string;
};

function normalizeAccess(body: AccessBody) {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const inviteCode = typeof body.inviteCode === "string" ? body.inviteCode.trim() : "";
  const testerId = typeof body.testerId === "string" ? body.testerId.trim() : "";

  const hasIdentitySignal = Boolean(email || inviteCode || testerId);

  return {
    allowed: hasIdentitySignal,
    reason: hasIdentitySignal ? "preview_identity_signal_present" : "identity_signal_required",
    mode: "controlled",
  };
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "lumora-private-beta-access",
      status: "access_contract_ready",
      allowed: false,
      reason: "identity_signal_required",
      mode: "controlled",
      warnings: [
        "GET validates route availability only. Real access approval must use DB-backed allowlist and authenticated identity.",
      ],
      ts: Date.now(),
    },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as AccessBody;
  const access = normalizeAccess(body);

  return NextResponse.json(
    {
      ok: true,
      service: "lumora-private-beta-access",
      status: "checked",
      ...access,
      warnings: [
        "Preview access check is contract-safe. Production private beta must verify authenticated identity and allowlist persistence.",
      ],
      ts: Date.now(),
    },
    { status: 200 },
  );
}
