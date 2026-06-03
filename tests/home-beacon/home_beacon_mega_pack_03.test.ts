import fs from "node:fs";
import { describe, expect, it } from "vitest";

import {
  getDashboardWidgets,
  interactionBridgeReady,
  createSignal,
  notificationEvolutionReady
} from "@/src/core/home-beacon";

describe("Home Beacon Mega Pack 3/5", () => {
  it("creates dashboard layer", () => {
    expect(getDashboardWidgets().length).toBeGreaterThan(4);
  });

  it("connects interaction system bridge", () => {
    expect(interactionBridgeReady()).toBe(true);
  });

  it("creates light signals", () => {
    expect(createSignal("echo").badgeFree).toBe(true);
    expect(createSignal("reflection").pulse).toBe(true);
  });

  it("enables notification evolution", () => {
    expect(notificationEvolutionReady()).toBe(true);
  });

  it("mounts dashboard into beacon", () => {
    const dashboard = fs.readFileSync(
      "components/home-beacon/HomeBeaconDashboard.tsx",
      "utf8"
    );

    expect(dashboard).toContain("home-beacon-dashboard");
  });
});
