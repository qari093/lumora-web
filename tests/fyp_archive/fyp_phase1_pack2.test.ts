import { describe, expect, it } from "vitest";
import {
  classifyArchiveSafety,
  enforcePublicSettingRule,
  extractArchiveYear,
  isPreferredArchiveEra,
  rejectModernPrivateIndividualRisk,
  rejectUnsafeArchiveCategory,
} from "../../src/lib/fyp_archive/safety_filter";

describe("Phase 1 Pack 2 — Archive Safety Filter", () => {
  it("extracts archive year", () => {
    expect(extractArchiveYear({ title: "Family picnic 1962" })).toBe(1962);
  });

  it("prefers pre-1980 footage", () => {
    expect(isPreferredArchiveEra({ year: 1975 })).toBe(true);
    expect(isPreferredArchiveEra({ year: 1995 })).toBe(false);
  });

  it("rejects modern private individual risk", () => {
    expect(rejectModernPrivateIndividualRisk({ year: 2015, setting: "private home" })).toBe(true);
    expect(rejectModernPrivateIndividualRisk({ year: 2015, setting: "public event" })).toBe(false);
  });

  it("rejects unsafe categories", () => {
    expect(rejectUnsafeArchiveCategory({ title: "graphic medical surgery" })).toBe(true);
  });

  it("enforces public setting or historical rule", () => {
    expect(enforcePublicSettingRule({ year: 1960, title: "home movie family" })).toBe(true);
    expect(enforcePublicSettingRule({ year: 2010, setting: "private" })).toBe(false);
  });

  it("adds safety classification flag", () => {
    const out = classifyArchiveSafety({ year: 1965, title: "public street crowd" });
    expect(out.safe).toBe(true);
    expect(out.reason).toBe("safe");
  });
});
