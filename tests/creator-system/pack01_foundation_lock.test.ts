import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { CREATOR_ATTRACTION_BOUNDARY, isCreatorAttractionFeature } from "@/src/lib/creator-system/foundation/creatorAttractionBoundary";
import { CREATOR_DASHBOARD_BOUNDARY, isCreatorDashboardFeature } from "@/src/lib/creator-system/foundation/creatorDashboardBoundary";
import { explainCreatorSystemTerm } from "@/src/lib/creator-system/foundation/terminology";
import { assertNoFakeMetrics, validateCreatorMetricForCircle } from "@/src/lib/creator-system/foundation/noFakeMetricsRule";

describe("Creator System Pack 01 — Foundation Lock", () => {
  it("locks canonical scope document", () => {
    expect(fs.existsSync("docs/creator-system/canonical-scope.md")).toBe(true);
    const doc = fs.readFileSync("docs/creator-system/canonical-scope.md", "utf8");
    expect(doc).toContain("Creator Attraction");
    expect(doc).toContain("Creator Dashboard");
    expect(doc).toContain("Fake views");
  });

  it("creates creator attraction boundary", () => {
    expect(CREATOR_ATTRACTION_BOUNDARY.module).toBe("creator-attraction");
    expect(isCreatorAttractionFeature("phantom-circle")).toBe(true);
    expect(CREATOR_ATTRACTION_BOUNDARY.forbidden).toContain("fake-views");
  });

  it("creates creator dashboard boundary", () => {
    expect(CREATOR_DASHBOARD_BOUNDARY.module).toBe("creator-dashboard");
    expect(isCreatorDashboardFeature("your-moment-card")).toBe(true);
    expect(CREATOR_DASHBOARD_BOUNDARY.forbidden).toContain("public-view-count");
  });

  it("defines shared terminology", () => {
    expect(explainCreatorSystemTerm("Witness Name")).toContain("continuity");
    expect(explainCreatorSystemTerm("Micro-Value Window")).toContain("trust");
  });

  it("blocks fake/vanity metrics and allows human signals", () => {
    expect(validateCreatorMetricForCircle("view").ok).toBe(false);
    expect(validateCreatorMetricForCircle("silent-ovation").ok).toBe(true);
    expect(assertNoFakeMetrics(["present", "hold", "silent-ovation"]).ok).toBe(true);
    expect(assertNoFakeMetrics(["present", "view"]).ok).toBe(false);
  });
});
