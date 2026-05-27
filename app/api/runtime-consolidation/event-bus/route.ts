import { NextResponse } from "next/server";
import {
  apiSuccess,
  buildUnifiedEventBusReport,
  createLumoraEvent,
  validateLumoraEvent
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample = createLumoraEvent({
    kind: "telemetry.metric",
    actorId: "runtime-consolidation",
    payload: { metric: "event_bus_alive", value: 1 },
    source: "runtime-consolidation-pack-07"
  });

  return NextResponse.json(
    apiSuccess({
      data: {
        report: buildUnifiedEventBusReport(),
        sample,
        validation: validateLumoraEvent(sample)
      },
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-07",
      runtime: "node"
    })
  );
}
