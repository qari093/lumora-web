import { describe, expect, it } from "vitest";
import {
  allowControlledImperfection,
  hasArchiveMotionPresence,
  passesArchiveDuration,
  passesArchiveQualityFilter,
  prefersArchiveHumanActivity,
  rejectsUnusableArchiveFootage,
} from "../../src/lib/fyp_archive/quality_filter";

describe("Phase 1 Pack 5 — Archive Quality Filter", () => {
  it("enforces duration limits", () => {
    expect(passesArchiveDuration({ duration: 12 })).toBe(true);
    expect(passesArchiveDuration({ duration: 4 })).toBe(false);
    expect(passesArchiveDuration({ duration: 90 })).toBe(false);
  });

  it("detects motion presence", () => {
    expect(hasArchiveMotionPresence({ title: "kids playing street" })).toBe(true);
  });

  it("prefers human activity", () => {
    expect(prefersArchiveHumanActivity({ title: "family crowd street" })).toBe(true);
  });

  it("rejects unusable footage", () => {
    expect(rejectsUnusableArchiveFootage({ sizeBytes: 10 })).toBe(true);
    expect(rejectsUnusableArchiveFootage({ title: "corrupt footage" })).toBe(true);
  });

  it("allows controlled imperfection", () => {
    expect(allowControlledImperfection({ title: "amateur home movie handheld" })).toBe(true);
  });

  it("passes full archive quality filter", () => {
    expect(passesArchiveQualityFilter({ duration: 20, title: "crowd street event", sizeBytes: 200000 })).toBe(true);
  });
});
