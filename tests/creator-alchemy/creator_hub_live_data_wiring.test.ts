import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  DEMO_CREATOR_ALCHEMY_EVENTS,
  DEMO_CREATOR_ID,
  aggregateCreatorEvents,
  buildLiveCreatorDashboard,
  validateCreatorAlchemyEvent
} from "@/src/core/creator-alchemy/live";

describe("Creator Hub Live Data Wiring", () => {
  it("validates creator alchemy events", () => {
    expect(validateCreatorAlchemyEvent(DEMO_CREATOR_ALCHEMY_EVENTS[0]!)).toBe(true);
    expect(validateCreatorAlchemyEvent({ ...DEMO_CREATOR_ALCHEMY_EVENTS[0]!, id: "" })).toBe(false);
  });

  it("aggregates live events into creator signals", () => {
    const aggregate = aggregateCreatorEvents(DEMO_CREATOR_ID, DEMO_CREATOR_ALCHEMY_EVENTS);

    expect(aggregate.totalEvents).toBe(5);
    expect(aggregate.quietGiftCount).toBe(1);
    expect(aggregate.silentReturnCount).toBe(2);
    expect(aggregate.strongestTimestamp).toBe(40);
  });

  it("builds a live dashboard from event data", () => {
    const dashboard = buildLiveCreatorDashboard(DEMO_CREATOR_ID, DEMO_CREATOR_ALCHEMY_EVENTS);

    expect(dashboard.stage).toBe("resonance");
    expect(dashboard.zones).toContain("constellation_river");
    expect(dashboard.quietImpact.quietGiftsText).toContain("1 quiet gifts");
    expect(dashboard.whisper?.text).toContain("replayed");
  });

  it("creates event ingestion API route", () => {
    expect(existsSync("app/api/creator-alchemy/events/route.ts")).toBe(true);
    const route = readFileSync("app/api/creator-alchemy/events/route.ts", "utf8");
    expect(route).toContain("POST");
    expect(route).toContain("validateCreatorAlchemyEvent");
  });

  it("updates dashboard API route with live demo mode", () => {
    const route = readFileSync("app/api/creator-alchemy/dashboard/route.ts", "utf8");
    expect(route).toContain("live");
    expect(route).toContain("buildLiveCreatorDashboard");
    expect(route).toContain("live-demo");
  });
});
