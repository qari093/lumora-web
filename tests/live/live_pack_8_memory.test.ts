import { describe, expect, it } from "vitest";
import { createAfterglowArtifacts } from "../../src/live/memory/afterglowCore";
import { createAnnualCapsule } from "../../src/live/memory/timeCapsuleCore";
import { canGenerateHeritageMural } from "../../src/live/mythology/heritageMuralCore";

describe("Lumora Live Pack 8 — Memory", () => {
  it("creates three Afterglow artifacts", () => {
    const artifacts = createAfterglowArtifacts("event-1");
    expect(artifacts.map((a) => a.type)).toEqual(["pulse_reel", "echo_mosaic", "event_shard"]);
  });

  it("creates annual emotional time capsule", () => {
    const capsule = createAnnualCapsule("cap-1", "user-1", new Date("2026-01-01T00:00:00Z"));
    expect(capsule.opensAt).toContain("2027-01-01");
    expect(capsule.sealed).toBe(true);
  });

  it("gates Heritage Murals behind real community history", () => {
    expect(canGenerateHeritageMural(2, 20)).toBe(false);
    expect(canGenerateHeritageMural(3, 10)).toBe(true);
  });
});
