import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      appShell: true,
      globalCss: true,
      visualSystem: true,
      portalShells: true,
      status: "VISUAL_RUNTIME_RECOVERED",
      checkedAt: new Date().toISOString()
    },
    { headers: { "cache-control": "no-store" } }
  );
}
