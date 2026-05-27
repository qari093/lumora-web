import { describe, expect, it } from "vitest";
import {
  communitySystems,
  communityActivationReady,
  sharedListening,
  emotionalEvents,
} from "../../src/echo/community/communityActivation";

describe("Echo Pack 23 — Content + Community", () => {
  it("supports community systems", () => {
    expect(communitySystems).toContain("shared-aura");
  });

  it("supports community activation", () => {
    expect(communityActivationReady()).toBe(true);
  });

  it("supports emotional events", () => {
    expect(sharedListening().synchronized).toBe(true);
    expect(emotionalEvents().active).toBe(true);
  });
});
