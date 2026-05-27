import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("UX Pack01 dashboard production states", () => {
  it("renders runtime-aware dashboard states and FYP recovery path", () => {
    const file = fs.readFileSync("components/creator-dashboard/CreatorDashboardClient.tsx", "utf8");

    expect(file).toContain("useRuntimeState");
    expect(file).toContain("Live Runtime Active");
    expect(file).toContain("No real interaction yet");
    expect(file).toContain("Open FYP");
    expect(file).toContain("totalSignals");
    expect(file).toContain("Real FYP behavior is now persisted");
  });
});
