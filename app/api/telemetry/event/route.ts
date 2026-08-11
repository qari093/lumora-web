import { NextRequest, NextResponse } from "next/server";

import { persistObservabilityEvent } from "@/src/lib/observability/persistence";
import {
  enforceObservabilityRateLimit,
  observabilityRateLimitHeaders,
} from "@/src/lib/observability/abuseProtection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clampString(
  value: unknown,
  maximumLength: number,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maximumLength);
}

function telemetryEnabled(): boolean {
  return process.env.LUMORA_TELEMETRY_ENABLED === "1";
}

function telemetryMode(): string {
  return (
    process.env.LUMORA_TELEMETRY_MODE?.trim() ||
    "silent"
  );
}

function noStoreHeaders() {
  return {
    "cache-control": "no-store, max-age=0",
  };
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      enabled: telemetryEnabled(),
      mode: telemetryMode(),
      persistence: telemetryEnabled()
        ? "database"
        : "disabled",
    },
    {
      status: 200,
      headers: noStoreHeaders(),
    },
  );
}

export async function POST(request: NextRequest) {
  const enabled = telemetryEnabled();
  const mode = telemetryMode();

  if (!enabled) {
    return NextResponse.json(
      {
        ok: true,
        enabled: false,
        mode,
        accepted: false,
        persisted: false,
      },
      {
        status: 200,
        headers: noStoreHeaders(),
      },
    );
  }

  const rateLimit =
    await enforceObservabilityRateLimit(request, {
      scope: "api.telemetry.event",
      limit: 120,
      windowMs: 60_000,
      maxBodyBytes: 32_768,
    });

  const rateHeaders =
    observabilityRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: rateLimit.reason,
      },
      {
        status: rateLimit.status,
        headers: rateHeaders,
      },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<
      string,
      unknown
    >;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_json",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  const eventName = clampString(body.name, 120);

  if (!eventName) {
    return NextResponse.json(
      {
        ok: false,
        error: "telemetry_event_name_required",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  try {
    const event = await persistObservabilityEvent({
      category: "telemetry",
      eventType: eventName,
      severity: body.severity || "info",
      source: "api.telemetry.event",
      route: body.page || body.route,
      sessionId: body.sessionId,
      testerId: body.testerId,
      targetId: body.targetId,
      message: body.message,
      durationMs:
        body.durationMs || body.dur_ms,
      value: body.value,
      metadata:
        mode === "silent"
          ? undefined
          : body.meta || body.metadata,
      occurredAt: body.ts,
    });

    return NextResponse.json(
      {
        ok: true,
        enabled: true,
        mode,
        accepted: true,
        persisted: true,
        eventId: event.id,
      },
      {
        status: 201,
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("TELEMETRY_EVENT_PERSIST_FAILED", {
      message:
        error instanceof Error
          ? error.message
          : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        error: "telemetry_event_persistence_failed",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}
