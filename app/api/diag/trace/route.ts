import { NextResponse } from "next/server";
import { logger } from "@/lib/observability/logger";
import { startTrace, finishTrace } from "@/lib/observability/trace";

export const dynamic = "force-dynamic";

export async function GET() {
  const trace = startTrace("api.diag.trace");
  logger.info("api.diag.trace", "trace_started", undefined, trace.requestId);
  const summary = finishTrace(trace);
  logger.info("api.diag.trace", "trace_finished", { durationMs: summary.durationMs }, trace.requestId);

  return NextResponse.json(
    {
      ok: true,
      trace: summary,
    },
    {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "x-request-id": summary.requestId,
      },
    }
  );
}
