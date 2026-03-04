import { NextRequest, NextResponse } from "next/server";

const portalKey = "SHARE";
const portalName = "Share";

function envEnabled(k: string): boolean {
  const a = process.env[`LUMORA_PORTAL_${k}_ENABLED`];
  const b = process.env[`NEXT_PUBLIC_LUMORA_PORTAL_${k}_ENABLED`];
  const v = (a ?? b ?? "").trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes" || v === "on") return true;
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  return true; // default enabled for user-alive activation
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";
  const enabled = envEnabled(portalKey);

  const payload: any = {
    ok: true,
    portal: portalName,
    key: portalKey.toLowerCase(),
    enabled,
    source: "user-alive:portal-alive",
    ts: Date.now(),
  };

  if (debug) {
    payload.debug = {
      env: {
        [`LUMORA_PORTAL_${portalKey}_ENABLED`]: process.env[`LUMORA_PORTAL_${portalKey}_ENABLED`],
        [`NEXT_PUBLIC_LUMORA_PORTAL_${portalKey}_ENABLED`]: process.env[`NEXT_PUBLIC_LUMORA_PORTAL_${portalKey}_ENABLED`],
      },
    };
  }

  return NextResponse.json(payload, { status: 200 });
}
