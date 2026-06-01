import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const required = {
    app: true,
    deployment: true,
    previewSafe: true,
  };

  return NextResponse.json(
    {
      ok: true,
      ready: true,
      status: "ready_preview_safe",
      checks: required,
      warnings: [
        "Preview readiness does not prove production DB, auth provider, Stripe settlement, or webhook replay.",
      ],
      ts: Date.now(),
    },
    { status: 200 }
  );
}
