import { NextResponse } from "next/server";

import {
  createGmarTelemetryEvent
} from "@/src/core/gmar/final-completion/observability/analytics";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const event = createGmarTelemetryEvent({
      type:
        body.type === "session" ||
        body.type === "reward" ||
        body.type === "economy" ||
        body.type === "retention" ||
        body.type === "error" ||
        body.type === "performance" ||
        body.type === "realtime" ||
        body.type === "dashboard"
          ? body.type
          : "session",
      playerId:
        typeof body.playerId === "string"
          ? body.playerId
          : "",
      name:
        typeof body.name === "string"
          ? body.name
          : "",
      value:
        typeof body.value === "number"
          ? body.value
          : undefined,
      metadata:
        body.metadata && typeof body.metadata === "object"
          ? body.metadata
          : {}
    });

    return NextResponse.json({
      ok: true,
      event
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR telemetry event failed."
      },
      { status: 400 }
    );
  }
}
