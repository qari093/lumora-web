import { NextRequest, NextResponse } from "next/server";
import { createTelemetryEvent } from "@/lib/telemetry/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.type) {
      return NextResponse.json(
        { ok: false, error: "missing_event_type" },
        { status: 400 }
      );
    }

    const event = createTelemetryEvent({
      type: body.type,
      sessionId: body.sessionId,
      userId: body.userId,
      mode: body.mode,
      portal: body.portal,
      targetId: body.targetId,
      value: typeof body.value === "number" ? body.value : undefined,
      metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : undefined,
    });

    console.log("LUMORA_TELEMETRY", JSON.stringify(event));

    return NextResponse.json({
      ok: true,
      source: "lumora_telemetry_v1",
      event,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "telemetry_ingest_failed" },
      { status: 500 }
    );
  }
}
