import { describe, expect, it } from "vitest";
import {
  ARCHIVE_SOURCES,
  isPublicDomain,
  rejectUnknownLicense,
  normalizeArchiveMeta
} from "../../src/lib/fyp_archive/source_foundation";

describe("Phase 1 Pack 1 — Archive Source Foundation", () => {
  it("locks archive sources", () => {
    expect(ARCHIVE_SOURCES.internetArchive.enabled).toBe(true);
    expect(ARCHIVE_SOURCES.prelinger.enabled).toBe(true);
  });

  it("accepts public domain content", () => {
    expect(isPublicDomain({ license: "Public Domain" })).toBe(true);
  });

  it("rejects unknown licenses", () => {
    expect(rejectUnknownLicense({ license: "unknown" })).toBe(true);
  });

  it("normalizes archive metadata", () => {
    const out = normalizeArchiveMeta({ identifier: "abc", title: "test" });
    expect(out.id).toBe("abc");
    expect(out.source).toBe("archive");
  });
});
