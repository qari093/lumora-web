import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { persistObservabilityEvent } from "@/src/lib/observability/persistence";
import {
  enforceObservabilityRateLimit,
  observabilityRateLimitHeaders,
} from "@/src/lib/observability/abuseProtection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelemetryEvent = {
  type?: unknown;
  path?: unknown;
  ts?: unknown;
  dur_ms?: unknown;
  meta?: unknown;
};

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clampString(value: unknown, maximumLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, maximumLength) : null;
}

function readCookie(
  request: Request,
  name: string,
): string | null {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");

    if (separator < 0) {
      continue;
    }

    const key = part.slice(0, separator).trim();

    if (key !== name) {
      continue;
    }

    const rawValue = part.slice(separator + 1).trim();

    if (!rawValue) {
      return null;
    }

    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return null;
}

function getTesterId(request: Request): string {
  const cookieId = clampString(
    readCookie(request, "lumora_tester_id"),
    200,
  );

  if (cookieId) {
    return cookieId;
  }

  const fingerprint = [
    request.headers.get("user-agent") || "",
    request.headers.get("accept-language") || "",
    request.headers.get("sec-ch-ua") || "",
  ].join("|");

  return `anon_${crypto
    .createHash("sha256")
    .update(fingerprint)
    .digest("hex")
    .slice(0, 16)}`;
}

function normalizeEvents(body: unknown): TelemetryEvent[] {
  if (body && typeof body === "object" && Array.isArray((body as { events?: unknown }).events)) {
    return (body as { events: TelemetryEvent[] }).events.slice(0, 50);
  }

  if (body && typeof body === "object" && typeof (body as TelemetryEvent).type === "string") {
    return [body as TelemetryEvent];
  }

  return [];
}

export async function POST(request: NextRequest) {
  const rateLimit =
    await enforceObservabilityRateLimit(request, {
      scope: "api.telemetry.track",
      limit: 60,
      windowMs: 60_000,
      maxBodyBytes: 65_536,
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

  const raw = await request.text();
  const body = safeJson(raw);
  const events = normalizeEvents(body);

  if (events.length === 0) {
    return NextResponse.json(
      { ok: false, error: "bad_request", hint: "send {events:[{type,path,meta}]} or {type,path,...}" },
      { status: 400, headers: { "cache-control": "no-store, max-age=0" } },
    );
  }

  const testerId = getTesterId(request);

  try {
    const persisted = await Promise.all(
      events.map(async event => {
        const eventType = clampString(event.type, 120);
        if (!eventType) throw new Error("telemetry_event_type_required");

        return persistObservabilityEvent({
          category: "telemetry",
          eventType,
          severity: "info",
          source: "api.telemetry.track",
          route: event.path,
          testerId,
          durationMs: event.dur_ms,
          metadata: event.meta,
          occurredAt: event.ts,
        });
      }),
    );

    return NextResponse.json(
      {
        ok: true,
        source: "database",
        testerId,
        accepted: persisted.length,
        eventIds: persisted.map(event => event.id),
      },
      { status: 201, headers: { "cache-control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("TELEMETRY_TRACK_PERSIST_FAILED", {
      testerId,
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { ok: false, error: "telemetry_track_persistence_failed" },
      { status: 500, headers: { "cache-control": "no-store, max-age=0" } },
    );
  }
}
