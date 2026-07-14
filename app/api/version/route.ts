import { NextResponse } from "next/server";
import { getLumoraRuntimeMetadata } from "@/src/lib/runtime/deploymentMetadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      ...getLumoraRuntimeMetadata(),
      checkedAt: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  );
}
