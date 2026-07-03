import { describe, expect, it } from "vitest";
import {
  addStarToConstellation,
  appendTimelineItem,
  createAtmosphereShare,
  createEchoShare,
  createJourneyCapsule,
  createLivingMemoryRecord,
  createLivingMemoryTimeline,
  createMemoryConstellation,
  createMemoryStar,
  createPassiveDiscoveryWhisper,
  createSharedGarden,
  createSharedSilenceSignal,
  createTimeCapsule,
  createUniversalShareIntent,
  evolveMemoryStar,
  materializeShareIntent,
  plantMemoryInGarden,
} from "@/src/core/share";

function demoShare() {
  return materializeShareIntent(
    createUniversalShareIntent(
      {
        kind: "video",
        sourcePortal: "fyp",
        destinationPortal: "lumaspace",
        sourceObjectId: "trace_living_001",
        title: "Living Wonder Trace",
        createdBy: "founder",
        metadata: {
          mood: "wonder",
          atmosphere: "cyan-stardust",
          echo: true,
          echoDurationSeconds: 12,
        },
      },
      "lumaspace",
      "silent",
    ),
  );
}

describe("USL Mega Pack 05 — Living Memories Ω", () => {
  it("turns shares into Memory Stars and evolves them", () => {
    const star = createMemoryStar(demoShare());
    const evolved = evolveMemoryStar(star, 1);

    expect(star.id).toContain("memory_star_");
    expect(star.mood).toBe("wonder");
    expect(star.passiveDiscovery).toBe(true);
    expect(evolved.brightness).toBeGreaterThan(star.brightness);
  });

  it("creates Shared Gardens and Memory Constellations", () => {
    const star = createMemoryStar(demoShare());
    const garden = plantMemoryInGarden(createSharedGarden("waqar", "Wonder Garden"), star);
    const constellation = addStarToConstellation(
      createMemoryConstellation("Founders", [star], ["waqar"]),
      evolveMemoryStar(star, 1),
      "ayesha",
    );

    expect(garden.flowers).toHaveLength(1);
    expect(garden.growthScore).toBeGreaterThan(0);
    expect(constellation.stars).toHaveLength(1);
    expect(constellation.contributors).toContain("ayesha");
  });

  it("creates Journey Capsules and Time Capsules", () => {
    const star = createMemoryStar(demoShare());
    const journey = createJourneyCapsule("First Orbit", [star]);
    const time = createTimeCapsule("Future Orbit", [star], "2030-01-01T00:00:00.000Z");

    expect(journey.delivery).toBe("now");
    expect(time.delivery).toBe("future");
    expect(time.unlockAt).toBe("2030-01-01T00:00:00.000Z");
  });

  it("creates Echo Share and Atmosphere Share", () => {
    const share = demoShare();
    const echo = createEchoShare(share, 33);
    const atmosphere = createAtmosphereShare(share, "wonder", "cyan-stardust");

    expect(echo.voiceDurationSeconds).toBe(15);
    expect(atmosphere.durationMs).toBe(10000);
    expect(atmosphere.atmosphere).toBe("cyan-stardust");
  });

  it("creates Living Memory records, timeline, passive discovery, and shared silence", () => {
    const record = createLivingMemoryRecord(demoShare());
    const updated = appendTimelineItem(record, {
      kind: "shared_silence",
      title: "Shared Silence",
      weight: 0.5,
    });
    const timeline = createLivingMemoryTimeline([updated]);

    expect(record.echo?.voiceDurationSeconds).toBe(12);
    expect(record.atmosphere?.atmosphere).toBe("cyan-stardust");
    expect(timeline.length).toBe(2);
    expect(createPassiveDiscoveryWhisper(record)).toContain("drifted into your orbit");
    expect(createSharedSilenceSignal(record)).toContain("quiet glow");
  });
});
