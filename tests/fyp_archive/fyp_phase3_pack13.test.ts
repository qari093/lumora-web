import { describe, expect, it } from "vitest";
import {
  attachLicenseMetadata,
  buildArchiveAuditEntry,
  buildInternalAttribution,
  enforceComplianceRules,
  isArchiveBlacklisted,
} from "../../src/lib/fyp_archive/legal_trust";

describe("Phase 3 Pack 13 — Legal + Trust Layer", () => {
  it("attaches license metadata", () => {
    const out = attachLicenseMetadata({ sourceUrl: "https://archive.org/details/a" });
    expect(out.license).toBeTruthy();
    expect(out.licenseSource).toContain("archive.org");
  });

  it("builds audit entry", () => {
    const out = buildArchiveAuditEntry({ sourceId: "abc", license: "public domain" });
    expect(out.sourceId).toBe("abc");
    expect(out.license).toBe("public domain");
  });

  it("builds internal attribution", () => {
    const out = buildInternalAttribution({ title: "Clip", sourceUrl: "x" });
    expect(out.title).toBe("Clip");
    expect(out.source).toBe("archive");
  });

  it("checks blacklist", () => {
    expect(isArchiveBlacklisted({ sourceId: "bad" }, ["bad"])).toBe(true);
  });

  it("enforces compliance rules", () => {
    expect(
      enforceComplianceRules({
        sourceId: "ok",
        sourceUrl: "https://archive.org/details/ok",
        license: "public domain",
      }).ok,
    ).toBe(true);

    expect(enforceComplianceRules({ sourceId: "bad", license: "unknown" }).ok).toBe(false);
  });
});
