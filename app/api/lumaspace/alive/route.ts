import { NextResponse } from "next/server";

function envEnabled(k: string): boolean {
  const a = process.env[`LUMORA_PORTAL_${k}_ENABLED`];
  const b = process.env[`NEXT_PUBLIC_LUMORA_PORTAL_${k}_ENABLED`];
  const v = (a ?? b);
  if (v == null) return true;
  const x = String(v).trim().toLowerCase();
  if (x === "1" || x === "true" || x === "yes" || x === "on") return true;
  if (x === "0" || x === "false" || x === "no" || x === "off") return false;
  return true;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";
  const enabled = envEnabled("LUMASPACE");

  const payload: any = {
    ok: true,
    portal: "LumaSpace",
    key: "LUMASPACE".toLowerCase(),
    enabled,
    mode: enabled ? "alive" : "disabled",
    ts: Date.now(),
    hints: [
      "Set LUMORA_PORTAL_LUMASPACE_ENABLED=0 to disable (server-only).",
      "Set NEXT_PUBLIC_LUMORA_PORTAL_LUMASPACE_ENABLED=0 to disable in client builds.",
      "Use ?debug=1 for env snapshot."
    ],
  };

  if (debug) {
    payload.debug = {
      env: {
        [`LUMORA_PORTAL_LUMASPACE_ENABLED`]: process.env[`LUMORA_PORTAL_LUMASPACE_ENABLED`],
        [`NEXT_PUBLIC_LUMORA_PORTAL_LUMASPACE_ENABLED`]: process.env[`NEXT_PUBLIC_LUMORA_PORTAL_LUMASPACE_ENABLED`],
      }
    };
  }

  return NextResponse.json(payload, { status: 200 });
}

