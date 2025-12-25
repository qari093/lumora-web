import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const enabled = process.env.LUMORA_MODERATION_ENABLED === "1";
  return NextResponse.json(
    {
      ok: true,
      enabled,
      policy: {
        mode: "private_live",
        defaults: {
          blocklists: true,
          rateLimits: "enabled_in_later_steps",
          reportFlows: true,
          autoHideOnReports: true
        },
        notes: [
          "This endpoint declares moderation guard posture for Private Live.",
          "Actual enforcement hooks should be wired in content publish / comments / DMs when those endpoints exist."
        ]
      }
    },
    { status: 200 }
  );
}
