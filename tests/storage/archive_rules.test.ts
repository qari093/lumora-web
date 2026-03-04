import { describe, it, expect } from "vitest";
import { decideArchiveTier, validateArchivePolicy, R2_ARCHIVE_POLICY_V1 } from "@/lib/storage/archiveRules";

describe("archive rules (R2 lifecycle alignment)", () => {
  it("policy validates", () => {
    expect(validateArchivePolicy(R2_ARCHIVE_POLICY_V1).ok).toBe(true);
  });

  it("ugc stays HOT early, then WARM, then ARCHIVE", () => {
    const now = 1700000000000;
    const created = now - 1 * 24 * 60 * 60 * 1000;
    expect(decideArchiveTier({ contentType: "ugc", createdAtMs: created, nowMs: now }).tier).toBe("HOT");

    const createdHotDone = now - 10 * 24 * 60 * 60 * 1000;
    expect(decideArchiveTier({ contentType: "ugc", createdAtMs: createdHotDone, nowMs: now }).tier).toBe("WARM");

    const createdOld = now - 45 * 24 * 60 * 60 * 1000;
    expect(decideArchiveTier({ contentType: "ugc", createdAtMs: createdOld, nowMs: now }).tier).toBe("ARCHIVE");
  });

  it("trailers are never delete-eligible and go ARCHIVE after warm window", () => {
    const now = 1700000000000;
    const createdOld = now - 800 * 24 * 60 * 60 * 1000;
    const d = decideArchiveTier({ contentType: "trailer", createdAtMs: createdOld, nowMs: now });
    expect(d.tier).toBe("ARCHIVE");
    expect(d.deleteEligible).toBe(false);
  });

  it("ugc becomes delete-eligible after deleteAfterDays", () => {
    const now = 1700000000000;
    const createdOld = now - 400 * 24 * 60 * 60 * 1000;
    const d = decideArchiveTier({ contentType: "ugc", createdAtMs: createdOld, nowMs: now });
    expect(d.tier).toBe("ARCHIVE");
    expect(d.deleteEligible).toBe(true);
  });

  it("permanent flag keeps HOT and not deletable", () => {
    const now = 1700000000000;
    const createdOld = now - 999 * 24 * 60 * 60 * 1000;
    const d = decideArchiveTier({ contentType: "ugc", createdAtMs: createdOld, nowMs: now, permanent: true });
    expect(d.tier).toBe("HOT");
    expect(d.deleteEligible).toBe(false);
  });
});
