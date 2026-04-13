import { NextResponse } from "next/server";
import { validateEnv } from "@/lib/env/validateEnv";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = validateEnv();
  const ready = env.ok;

  return NextResponse.json(
    {
      ok: ready,
      service: "lumora-web",
      status: ready ? "ready" : "not_ready",
      checks: {
        env,
      },
      ts: Date.now(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    }
  );
}
