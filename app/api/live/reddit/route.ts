import { NextResponse } from "next/server";

import { ingestRedditSignals } from "@/lib/signals/providers/reddit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLimit = Number(searchParams.get("limit") ?? "10");
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 25)
    : 10;

  try {
    const result = await ingestRedditSignals({
      limit,
      useFixtureOnFailure: true
    });

    const items = result.signals.slice(0, limit);

    return NextResponse.json(
      {
        ok: result.ok && items.length > 0,
        service: "live",
        provider: "reddit",
        route: "/api/live/reddit",
        live_status: items.length > 0 ? "candidate_live" : "not_live",
        proof_status: items.length > 0 ? "pending" : "failed",
        source_of_truth: result.source,
        source: result.source,
        count: items.length,
        items,
        warning: result.error ?? null,
        ts: Date.now()
      },
      {
        status: items.length > 0 ? 200 : 503,
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "live",
        provider: "reddit",
        route: "/api/live/reddit",
        live_status: "not_live",
        proof_status: "failed",
        source_of_truth: "unavailable",
        source: "unavailable",
        count: 0,
        items: [],
        error: error instanceof Error ? error.message : "reddit_ingestion_failed",
        ts: Date.now()
      },
      {
        status: 503,
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  }
}
