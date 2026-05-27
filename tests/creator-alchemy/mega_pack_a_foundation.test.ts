import { describe, expect, it } from "vitest";
import {
  persistCreatorEvent,
  getPersistedEventCount,
  persistQuietGift,
  getQuietGiftLedger,
  persistConstellationProfile,
  getConstellationProfile
} from "@/src/core/creator-alchemy/persistence";

import {
  createAnalyticsSourceSnapshot,
  mergeAnalyticsSnapshots,
  inferConstellationCluster
} from "@/src/core/creator-alchemy/analytics";

import { buildRuntimeHealthSnapshot } from "@/src/core/creator-alchemy/health";

describe("Creator Alchemy Mega Pack A", () => {
  it("persists creator events safely", () => {
    const stored = persistCreatorEvent({
      id: "event-1",
      creatorId: "creator-1",
      viewerId: "viewer-1",
      videoId: "video-1",
      type: "watch",
      createdAt: "2026-01-01T00:00:00.000Z"
    });

    expect(stored?.id).toBe("event-1");
    expect(getPersistedEventCount()).toBeGreaterThan(0);
  });

  it("persists quiet gifts", () => {
    persistQuietGift({
      id: "gift-1",
      creatorId: "creator-1",
      viewerId: "viewer-1",
      giftType: "candle",
      createdAt: "2026-01-01T00:00:00.000Z"
    });

    expect(getQuietGiftLedger("creator-1")).toHaveLength(1);
  });

  it("persists constellation profiles", () => {
    persistConstellationProfile({
      creatorId: "creator-1",
      constellation: "Midnight Souls",
      confidence: 0.8,
      updatedAt: "2026-01-01T00:00:00.000Z"
    });

    expect(getConstellationProfile("creator-1")?.constellation).toBe("Midnight Souls");
  });

  it("creates analytics snapshots", () => {
    const snapshot = createAnalyticsSourceSnapshot("demo", []);

    expect(snapshot.healthy).toBe(true);
    expect(snapshot.source).toBe("demo");
  });

  it("merges analytics snapshots", () => {
    const merged = mergeAnalyticsSnapshots([
      createAnalyticsSourceSnapshot("a", []),
      createAnalyticsSourceSnapshot("b", [])
    ]);

    expect(merged).toHaveLength(0);
  });

  it("infers constellation clusters", () => {
    const cluster = inferConstellationCluster("creator-1", [
      {
        id: "e1",
        creatorId: "creator-1",
        viewerId: "viewer-1",
        videoId: "video-1",
        type: "rewatch",
        createdAt: "2026-01-01T00:00:00.000Z"
      },
      {
        id: "e2",
        creatorId: "creator-1",
        viewerId: "viewer-2",
        videoId: "video-1",
        type: "rewatch",
        createdAt: "2026-01-01T00:00:00.000Z"
      }
    ]);

    expect(cluster.constellation).toBe("Midnight Souls");
  });

  it("builds runtime health snapshots", () => {
    const health = buildRuntimeHealthSnapshot();

    expect(health.ok).toBe(true);
    expect(typeof health.persistedEvents).toBe("number");
  });
});
