import { describe, expect, it } from "vitest";
import {
  FYP_ALLOWED_SOURCE_REGISTRY,
  canServeFypSourceDirectly,
  requiresFypAttribution,
  validateFypSourceRegistry
} from "../../../src/core/fyp/legal/sourceGovernance";
import { evaluateFypLicenseGate } from "../../../src/core/fyp/legal/licenseGate";

describe("FYP Omega Pack 02 — Legal Source Governance", () => {
  it("has a valid source registry", () => {
    expect(validateFypSourceRegistry()).toBe(true);
    expect(FYP_ALLOWED_SOURCE_REGISTRY.length).toBeGreaterThanOrEqual(5);
  });

  it("allows direct safe sources", () => {
    expect(canServeFypSourceDirectly("PEXELS")).toBe(true);
    expect(canServeFypSourceDirectly("PIXABAY")).toBe(true);
    expect(canServeFypSourceDirectly("MIXKIT")).toBe(true);
  });

  it("blocks embed-only direct serving", () => {
    expect(canServeFypSourceDirectly("YOUTUBE_OFFICIAL")).toBe(false);
    expect(evaluateFypLicenseGate({ sourceId: "YOUTUBE_OFFICIAL", videoId: "yt_1" }).allowed).toBe(false);
  });

  it("blocks non-commercial source sharing into LumaSpace", () => {
    const result = evaluateFypLicenseGate({
      sourceId: "INTERNET_ARCHIVE",
      videoId: "archive_1",
      shareTarget: "lumaspace"
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("non_commercial_source_blocked_for_lumaspace");
  });

  it("preserves attribution requirement", () => {
    expect(requiresFypAttribution("NASA")).toBe(true);
    expect(evaluateFypLicenseGate({ sourceId: "NASA", videoId: "nasa_1" }).attributionRequired).toBe(true);
  });
});
