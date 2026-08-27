import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  PUBLIC_CONSTITUTION_ARCHIVE_BOUNDARY_VERSION,
  computePublicConstitutionArchiveDigest,
  getPublicConstitutionArchiveSnapshot,
  validatePublicConstitutionArchive,
} from "../../src/core/governance/publicConstitutionArchive";

describe("Mega Step 39 — public constitution publication/archive boundary", () => {
  it("uses the Mega39 boundary version", () => {
    expect(PUBLIC_CONSTITUTION_ARCHIVE_BOUNDARY_VERSION).toBe("mega39-v1");
  });

  it("publishes a public archive snapshot", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();

    expect(snapshot.public).toBe(true);
    expect(snapshot.archiveEntryCount).toBeGreaterThan(0);
    expect(snapshot.entries.length).toBe(snapshot.archiveEntryCount);
  });

  it("declares append-only publication", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();

    expect(snapshot.appendOnly).toBe(true);
    expect(snapshot.silentRewriteAllowed).toBe(false);
    expect(snapshot.deletionOfPublishedHistoryAllowed).toBe(false);
  });

  it("identifies the current constitutional version", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();
    const current =
      snapshot.entries[snapshot.entries.length - 1];

    expect(snapshot.currentVersion).toBe(current.version);
    expect(snapshot.currentDigest).toBe(current.digest);
  });

  it("uses deterministic SHA-256 publication digests", () => {
    const input = {
      version: "v-test",
      effectiveDate: "2026-08-19",
      publishedAt: "2026-08-19",
      documentPath: "/constitution/test",
      publicChangeRecord: "test publication",
      previousVersion: null,
      previousDigest: null,
    };

    const first =
      computePublicConstitutionArchiveDigest(input);
    const second =
      computePublicConstitutionArchiveDigest(input);

    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
  });

  it("detects digest tampering", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();
    const entry = snapshot.entries[0];

    const tampered = [
      {
        ...entry,
        publicChangeRecord: "silently rewritten record",
      },
    ];

    expect(validatePublicConstitutionArchive(tampered)).toBe(false);
  });

  it("rejects duplicate constitutional versions", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();
    const entry = snapshot.entries[0];

    expect(
      validatePublicConstitutionArchive([
        entry,
        {
          ...entry,
          status: "superseded",
        },
      ]),
    ).toBe(false);
  });

  it("requires first archive entry to be a root entry", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();
    const entry = snapshot.entries[0];

    const invalid = [
      {
        ...entry,
        previousVersion: "phantom-version",
        previousDigest: "a".repeat(64),
      },
    ];

    expect(validatePublicConstitutionArchive(invalid)).toBe(false);
  });

  it("does not publish personal data", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();

    expect(snapshot.privacySafeguards.personalDataPublished).toBe(false);
  });

  it("does not publish security-sensitive data", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();

    expect(
      snapshot.privacySafeguards.securitySensitiveDataPublished,
    ).toBe(false);
  });

  it("does not publish private moderation evidence", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();

    expect(
      snapshot.privacySafeguards.privateModerationEvidencePublished,
    ).toBe(false);
  });

  it("exposes a dedicated public GET route", () => {
    const route = readFileSync(
      resolve(
        process.cwd(),
        "app/api/governance/constitution-publication/route.ts",
      ),
      "utf8",
    );

    expect(route).toContain("export async function GET");
    expect(route).toContain("getPublicConstitutionArchiveSnapshot");
  });

  it("does not expose a mutation method", () => {
    const route = readFileSync(
      resolve(
        process.cwd(),
        "app/api/governance/constitution-publication/route.ts",
      ),
      "utf8",
    );

    expect(route).not.toContain("export async function POST");
    expect(route).not.toContain("export async function PUT");
    expect(route).not.toContain("export async function PATCH");
    expect(route).not.toContain("export async function DELETE");
  });

  it("does not require caller-supplied authority for public reading", () => {
    const route = readFileSync(
      resolve(
        process.cwd(),
        "app/api/governance/constitution-publication/route.ts",
      ),
      "utf8",
    );

    expect(route).not.toContain("requireAdminSession");
    expect(route).not.toContain("authenticated:");
    expect(route).not.toContain("delegated:");
  });

  it("uses explicit cache controls for public visibility", () => {
    const route = readFileSync(
      resolve(
        process.cwd(),
        "app/api/governance/constitution-publication/route.ts",
      ),
      "utf8",
    );

    expect(route).toContain("Cache-Control");
    expect(route).toContain("s-maxage=300");
  });

  it("does not claim a database-backed archive", () => {
    const core = readFileSync(
      resolve(
        process.cwd(),
        "src/core/governance/publicConstitutionArchive.ts",
      ),
      "utf8",
    );

    expect(core).not.toContain("prisma.");
    expect(core).not.toContain("DATABASE_URL");
  });

  it("retains the prior constitutional amendment boundary", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "src/core/governance/constitutionalAmendmentBoundary.ts",
      ),
      "utf8",
    );

    expect(source).toContain("append_only_history_required");
  });

  it("retains the prior ratification boundary", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "src/core/governance/constitutionalRatificationBoundary.ts",
      ),
      "utf8",
    );

    expect(source).toContain("CONSTITUTIONAL_RATIFICATION_BOUNDARY_VERSION");
  });

  it("retains rights-impact review continuity", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "src/core/governance/rightsImpactReviewBoundary.ts",
      ),
      "utf8",
    );

    expect(source).toContain("RIGHTS_IMPACT_REVIEW_BOUNDARY_VERSION");
  });

  it("keeps the platform constitution's append-only obligation", () => {
    const constitution = readFileSync(
      resolve(
        process.cwd(),
        "docs/governance/PLATFORM_CONSTITUTION.md",
      ),
      "utf8",
    );

    expect(constitution.toLowerCase()).toContain("append-only");
  });

  it("keeps public change-record continuity", () => {
    const constitution = readFileSync(
      resolve(
        process.cwd(),
        "docs/governance/PLATFORM_CONSTITUTION.md",
      ),
      "utf8",
    );

    expect(constitution.toLowerCase()).toContain(
      "public change record",
    );
  });

  it("publishes only an integrity boundary, not legal sovereignty", () => {
    const snapshot = getPublicConstitutionArchiveSnapshot();

    expect(snapshot.boundaryVersion).toBe("mega39-v1");
    expect(
      JSON.stringify(snapshot).toLowerCase(),
    ).not.toContain("sovereign state");
  });
});
