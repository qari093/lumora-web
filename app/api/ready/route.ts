import { NextResponse } from "next/server";
import {
  getLumoraRuntimeEnvironment,
  getLumoraRuntimeMetadata,
} from "@/src/lib/runtime/deploymentMetadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const appEnv = getLumoraRuntimeEnvironment();
  const productionRuntime = appEnv === "production";

  return NextResponse.json(
    {
      ok: true,
      ready: true,
      status: productionRuntime ? "ready" : "ready_non_production",
      checks: {
        applicationRuntime: true,
        deploymentRuntime: true,
        productionRuntime,
        databaseReadinessRoute: "/api/readyz",
      },
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
