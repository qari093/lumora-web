import { describe, expect, it } from "vitest";
import { launchActivation } from "../../src/echo/launch/activation";
import { globalReadiness } from "../../src/echo/launch/globalReadiness";
import { communityIgnition } from "../../src/echo/launch/communityIgnition";
import { ritualLaunch } from "../../src/echo/launch/ritualLaunch";

describe("Echo Pack 18 — Launch Activation", () => {
  it("supports launch activation", () => {
    expect(launchActivation().ready).toBe(true);
  });

  it("supports global readiness", () => {
    expect(globalReadiness().prepared).toBe(true);
  });

  it("supports ritual community launch", () => {
    expect(communityIgnition().active).toBe(true);
    expect(ritualLaunch().synchronized).toBe(true);
  });
});
