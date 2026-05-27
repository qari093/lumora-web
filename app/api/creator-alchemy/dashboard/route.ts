import { NextResponse } from "next/server";
import {
  buildCreatorHubRuntimeSnapshot,
  validateCreatorHubRuntimeSnapshot
} from "@/src/core/creator-alchemy/runtime";
import {
  DEMO_CREATOR_ALCHEMY_EVENTS,
  DEMO_CREATOR_ID,
  buildLiveCreatorDashboard
} from "@/src/core/creator-alchemy/live";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const live = url.searchParams.get("live") === "1";

    if (live) {
      const dashboard = buildLiveCreatorDashboard(DEMO_CREATOR_ID, DEMO_CREATOR_ALCHEMY_EVENTS);
      return NextResponse.json(
        {
          ok: true,
          mode: "live-demo",
          dashboard
        },
        {
          status: 200,
          headers: {
            "cache-control": "no-store"
          }
        }
      );
    }

    const snapshot = buildCreatorHubRuntimeSnapshot();

    return NextResponse.json(
      {
        ok: validateCreatorHubRuntimeSnapshot(snapshot),
        snapshot
      },
      {
        status: 200,
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "creator_hub_runtime_failed"
      },
      { status: 500 }
    );
  }
}
