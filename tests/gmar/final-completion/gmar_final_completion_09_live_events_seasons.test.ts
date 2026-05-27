import {
  createGmarSeason,
  createGmarLiveEvent,
  activateGmarLiveEvent,
  joinGmarLiveEvent,
  expireGmarLiveEvent,
  assertGmarLiveEvent
} from "@/src/core/gmar/final-completion/live/liveEventsSeasons";

describe("GMAR Final Completion Phase 09 — Live Events + Seasons", () => {
  it("creates active season", () => {
    const season = createGmarSeason({
      seasonId: "season_origin",
      title: "Origin Protocol",
      startedAt: "2026-05-09T00:00:00.000Z",
      endsAt: "2026-06-09T00:00:00.000Z"
    });

    expect(season.status).toBe("active");
    expect(season.rewardPoolReady).toBe(true);
    expect(season.leaderboardReady).toBe(true);
    expect(season.analyticsReady).toBe(true);
  });

  it("activates and joins live event", () => {
    const season = createGmarSeason({
      seasonId: "season_origin",
      title: "Origin Protocol",
      startedAt: "2026-05-09T00:00:00.000Z",
      endsAt: "2026-06-09T00:00:00.000Z"
    });

    const scheduled = createGmarLiveEvent({
      eventId: "event_origin_storm",
      season,
      title: "Origin Storm"
    });

    const active = activateGmarLiveEvent(scheduled);

    expect(active.status).toBe("live");

    const joined = joinGmarLiveEvent(active);

    expect(joined.participants).toBe(1);

    expect(assertGmarLiveEvent(joined)).toBe(true);
  });

  it("expires live event", () => {
    const season = createGmarSeason({
      seasonId: "season_origin",
      title: "Origin Protocol",
      startedAt: "2026-05-09T00:00:00.000Z",
      endsAt: "2026-06-09T00:00:00.000Z"
    });

    const active = activateGmarLiveEvent(
      createGmarLiveEvent({
        eventId: "event_origin_storm",
        season,
        title: "Origin Storm"
      })
    );

    const expired = expireGmarLiveEvent(active);

    expect(expired.status).toBe("expired");
  });

  it("blocks joining inactive event", () => {
    const season = createGmarSeason({
      seasonId: "season_origin",
      title: "Origin Protocol",
      startedAt: "2026-05-09T00:00:00.000Z",
      endsAt: "2026-06-09T00:00:00.000Z"
    });

    const scheduled = createGmarLiveEvent({
      eventId: "event_origin_storm",
      season,
      title: "Origin Storm"
    });

    expect(() =>
      joinGmarLiveEvent(scheduled)
    ).toThrow("GMAR live event is not active.");
  });
});
