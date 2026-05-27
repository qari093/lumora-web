import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

describe("Creator Hub Route Integration", () => {
  it("mounts the Creator Hub route", () => {
    expect(existsSync("app/creator-hub/page.tsx")).toBe(true);
    expect(existsSync("app/creator-hub/loading.tsx")).toBe(true);
  });

  it("connects BreathingDashboard to sealed Creator Alchemy model", () => {
    const page = readFileSync("app/creator-hub/page.tsx", "utf8");

    expect(page).toContain("BreathingDashboard");
    expect(page).toContain("buildBreathingDashboard");
    expect(page).toContain("SAMPLE_BREATHING_DASHBOARD_INPUT");
  });

  it("keeps route copy aligned with sanctuary tone", () => {
    const loading = readFileSync("app/creator-hub/loading.tsx", "utf8");

    expect(loading).toContain("quiet creative space");
    expect(loading).not.toMatch(/loading followers|boosting reach|viral/i);
  });
});
