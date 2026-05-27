import { NextResponse } from "next/server";

import {
  createGmarSeason,
  createGmarLiveEvent,
  activateGmarLiveEvent,
  assertGmarLiveEvent
} from "@/src/core/gmar/final-completion/live/liveEventsSeasons";

export async function POST() {
  try {
    const season = createGmarSeason({
      seasonId: "season_origin",
      title: "Origin Protocol",
      startedAt: "2026-05-09T00:00:00.000Z",
      endsAt: "2026-06-09T00:00:00.000Z"
    });

    const event = activateGmarLiveEvent(
      createGmarLiveEvent({
        eventId: "event_origin_storm",
        season,
        title: "Origin Storm"
      })
    );

    assertGmarLiveEvent(event);

    return NextResponse.json({
      ok: true,
      season,
      event
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR live event route failed."
      },
      { status: 400 }
    );
  }
}
