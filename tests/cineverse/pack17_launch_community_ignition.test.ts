import { describe, expect, it } from "vitest";
import {
  launchPhases,
  createLaunchEvent,
  shouldSyndicateToLumora,
  canActivateGlobalLaunch,
} from "../../src/cineverse/launch/runtime";

describe("CineVerse Pack 17 — Launch + Community Ignition", () => {
  it("defines launch phases", () => {
    expect(launchPhases).toContain("silent-launch");
  });

  it("creates synchronized launch events", () => {
    const event = createLaunchEvent("Global Emotional Marathon");

    expect(event.synchronized).toBe(true);
    expect(shouldSyndicateToLumora(event)).toBe(true);
  });

  it("requires 100 seeded films for global launch", () => {
    expect(canActivateGlobalLaunch(100)).toBe(true);
    expect(canActivateGlobalLaunch(40)).toBe(false);
  });
});
