import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  buildCreatorHubRuntimeSnapshot,
  validateCreatorHubRuntimeSnapshot
} from "@/src/core/creator-alchemy/runtime";

describe("Creator Hub Runtime Activation", () => {
  it("builds a valid sealed runtime snapshot", () => {
    const snapshot = buildCreatorHubRuntimeSnapshot();

    expect(validateCreatorHubRuntimeSnapshot(snapshot)).toBe(true);
    expect(snapshot.seal).toBe("LUMORA_CREATOR_ALCHEMY_CIVILIZATION_SEAL");
    expect(snapshot.dashboard.zones).toContain("whisper_panel");
    expect(snapshot.dashboard.zones).toContain("quiet_impact");
  });

  it("creates the dashboard API route", () => {
    expect(existsSync("app/api/creator-alchemy/dashboard/route.ts")).toBe(true);

    const route = readFileSync("app/api/creator-alchemy/dashboard/route.ts", "utf8");
    expect(route).toContain("buildCreatorHubRuntimeSnapshot");
    expect(route).toContain("validateCreatorHubRuntimeSnapshot");
    expect(route).toContain("no-store");
  });

  it("keeps Creator Hub page connected to runtime snapshot", () => {
    const page = readFileSync("app/creator-hub/page.tsx", "utf8");

    expect(page).toContain("buildCreatorHubRuntimeSnapshot");
    expect(page).toContain("BreathingDashboard");
    expect(page).toContain("snapshot.dashboard");
  });
});
