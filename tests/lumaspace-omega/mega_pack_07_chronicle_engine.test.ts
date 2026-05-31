import { describe, expect, it } from "vitest";
import { createChronicleMoment, rankChronicleMoments } from "@/src/core/lumaspace/omega/chronicle/chronicleCollector";
import { createChronicleTemplate } from "@/src/core/lumaspace/omega/chronicle/chronicleTemplate";
import { createChronicleNarration } from "@/src/core/lumaspace/omega/chronicle/chronicleNarrative";
import { buildChronicleStory, enableChronicleSharing } from "@/src/core/lumaspace/omega/chronicle/chronicleBuilder";
import { createChronicleRenderPlan } from "@/src/core/lumaspace/omega/chronicle/chronicleRenderer";
import { createChronicleArchive, addChronicleToArchive } from "@/src/core/lumaspace/omega/chronicle/chronicleArchive";
import { runLumaSpaceOmegaMegaPack07Runtime } from "@/src/core/lumaspace/omega/chronicle/omegaPack07Runtime";

describe("LumaSpace Ω∞ Mega Pack 07 — Chronicle Engine + Monthly Life Story", () => {
  it("creates and ranks chronicle moments", () => {
    const low = createChronicleMoment({
      id: "low",
      sourceMemoryId: "m1",
      title: "Low",
      summary: "Low",
      emotionalWeight: 10,
    });

    const high = createChronicleMoment({
      id: "high",
      sourceMemoryId: "m2",
      title: "High",
      summary: "High",
      emotionalWeight: 90,
      contributionWeight: 90,
      connectionWeight: 90,
    });

    expect(rankChronicleMoments([low, high])[0].id).toBe("high");
  });

  it("creates scope-specific templates", () => {
    expect(createChronicleTemplate("personal").tone).toBe("quiet_pride");
    expect(createChronicleTemplate("community").tone).toBe("celebration");
    expect(createChronicleTemplate("legacy").musicSeed).toContain("legacy");
  });

  it("creates reflective narration", () => {
    const moment = createChronicleMoment({
      id: "m",
      sourceMemoryId: "source",
      title: "A bridge formed",
      summary: "Connection",
    });

    const narration = createChronicleNarration({
      ownerName: "Waqar",
      scope: "personal",
      moments: [moment],
    });

    expect(narration).toContain("From your Space");
    expect(narration).toContain("A bridge formed");
  });

  it("builds monthly chronicle story", () => {
    const moment = createChronicleMoment({
      id: "m1",
      sourceMemoryId: "source1",
      title: "Mission completed",
      summary: "Progress",
    });

    const story = buildChronicleStory({
      ownerId: "u1",
      ownerName: "User",
      scope: "personal",
      monthKey: "2026-05",
      moments: [moment],
    });

    expect(story.id).toContain("2026-05");
    expect(story.durationSeconds).toBeGreaterThanOrEqual(15);
    expect(story.shareable).toBe(false);
  });

  it("enables chronicle sharing", () => {
    const story = buildChronicleStory({
      ownerId: "u2",
      ownerName: "User",
      scope: "personal",
      monthKey: "2026-05",
      moments: [],
    });

    expect(enableChronicleSharing(story).shareable).toBe(true);
  });

  it("creates render plan", () => {
    const moment = createChronicleMoment({
      id: "m2",
      sourceMemoryId: "source2",
      title: "Memory",
      summary: "Memory",
      emotionalWeight: 80,
    });

    const story = buildChronicleStory({
      ownerId: "u3",
      ownerName: "User",
      scope: "personal",
      monthKey: "2026-05",
      moments: [moment],
    });

    const plan = createChronicleRenderPlan(story);

    expect(plan.format).toBe("vertical_short");
    expect(plan.resolution).toBe("720x1280");
    expect(plan.segments).toHaveLength(1);
  });

  it("archives chronicle stories", () => {
    const archive = createChronicleArchive("u4");
    const story = buildChronicleStory({
      ownerId: "u4",
      ownerName: "User",
      scope: "personal",
      monthKey: "2026-05",
      moments: [],
    });

    expect(addChronicleToArchive(archive, story).stories).toHaveLength(1);
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack07Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.story.shareable).toBe(true);
    expect(runtime.renderPlan.format).toBe("vertical_short");
    expect(runtime.archive.stories).toHaveLength(1);
  });
});
