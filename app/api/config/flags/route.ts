import { NextResponse } from "next/server";
import { getLumoraFlags } from "@/lib/config/getLumoraFlags";

export const dynamic = "force-dynamic";

export async function GET() {
  const flags = getLumoraFlags();
  return NextResponse.json(
    {
      ok: true,
      flags,
      ts: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    }
  );
}
