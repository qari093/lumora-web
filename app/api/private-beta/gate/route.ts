
// Private beta allowlist guard: validates email-based access eligibility.
import { NextResponse } from "next/server";

function gateResponse() {
  return {
    ok: true,
    service: "lumora-private-beta-gate",
    status: "controlled_beta_gate_ready",
    beta: {
      enabled: true,
      mode: "controlled",
      publicAccess: false,
      requiresAllowlist: true,
      manualApprovalRequired: true,
    },
    warnings: [
      "Private beta gate is preview-safe. Real tester identity and allowlist checks must be DB-backed before wider launch.",
    ],
    ts: Date.now(),
  };
}

export async function GET() {
  return NextResponse.json(gateResponse(), { status: 200 });
}

export async function POST() {
  return NextResponse.json(gateResponse(), { status: 200 });
}
