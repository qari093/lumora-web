import { NextRequest, NextResponse } from "next/server";

import { persistErrorReport } from "@/src/lib/observability/persistence";
import {
  enforceObservabilityRateLimit,
  observabilityRateLimitHeaders,
} from "@/src/lib/observability/abuseProtection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeString(
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

function persistenceEnabled(): boolean {
  return (
    process.env.LUMORA_ERROR_MONITORING_ENABLED === "1"
  );
}

function monitoringMode(): string {
  return (
    process.env.LUMORA_ERROR_MONITORING_MODE?.trim() ||
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
      enabled: persistenceEnabled(),
      mode: monitoringMode(),
      persistence: persistenceEnabled()
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
  const enabled = persistenceEnabled();
  const mode = monitoringMode();

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
      scope: "api.errors.report",
      limit: 30,
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

  const message = safeString(body.message, 2_000);

  if (!message) {
    return NextResponse.json(
      {
        ok: false,
        error: "error_message_required",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  try {
    const report = await persistErrorReport({
      level: body.level,
      name: body.name,
      message,
      stack: body.stack,
      route: body.route,
      userAgent:
        body.ua ||
        body.userAgent ||
        request.headers.get("user-agent"),
      sessionId: body.sessionId,
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
        reportId: report.id,
      },
      {
        status: 201,
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("ERROR_REPORT_PERSIST_FAILED", {
      message:
        error instanceof Error
          ? error.message
          : String(error),
    });

    return NextResponse.json(
      {
        ok: false,
        error: "error_report_persistence_failed",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}
