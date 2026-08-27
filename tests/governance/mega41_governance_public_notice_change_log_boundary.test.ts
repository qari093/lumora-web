import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  GOVERNANCE_PUBLIC_NOTICE_BOUNDARY_VERSION,
  computeGovernanceNoticeDigest,
  createGovernancePublicNotice,
  getGovernancePublicNoticeSnapshot,
  validateGovernancePublicNoticeChain,
  type GovernancePublicNoticeInput,
} from "@/src/core/governance/governancePublicNotice";

function read(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const validInput = (
  overrides: Partial<GovernancePublicNoticeInput> = {},
): GovernancePublicNoticeInput => ({
  noticeId: "test-notice",
  changeType: "governance_policy_change",
  title: "Test governance notice",
  summary: "A safe public governance notice for contract testing.",
  publishedAt: "2026-08-19T18:00:00.000Z",
  effectiveAt: "2026-08-19T18:01:00.000Z",
  sourcePath: "/api/governance/test",
  ...overrides,
});

describe("Mega Step 41 — governance public notice and change-log boundary", () => {
  it("uses the Mega41 boundary version", () => {
    expect(GOVERNANCE_PUBLIC_NOTICE_BOUNDARY_VERSION).toBe("mega41-v1");
  });

  it("publishes a public read-only snapshot", () => {
    const snapshot = getGovernancePublicNoticeSnapshot();

    expect(snapshot.publicationMode).toBe("public_read_only");
    expect(snapshot.noticeCount).toBeGreaterThan(0);
    expect(snapshot.notices.length).toBe(snapshot.noticeCount);
  });

  it("declares append-only change history", () => {
    const snapshot = getGovernancePublicNoticeSnapshot();

    expect(snapshot.appendOnly).toBe(true);
    expect(snapshot.silentRemovalAllowed).toBe(false);
    expect(snapshot.silentRewriteAllowed).toBe(false);
  });

  it("uses deterministic SHA-256 digests", () => {
    const input = validInput();

    expect(computeGovernanceNoticeDigest(input)).toBe(
      computeGovernanceNoticeDigest(input),
    );

    expect(computeGovernanceNoticeDigest(input)).toMatch(/^[a-f0-9]{64}$/);
  });

  it("creates a verified governance notice", () => {
    const notice = createGovernancePublicNotice(validInput());

    expect(notice.digestAlgorithm).toBe("sha256");
    expect(notice.digest).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects an empty notice identifier", () => {
    expect(() =>
      createGovernancePublicNotice(validInput({ noticeId: " " })),
    ).toThrow("notice_id_required");
  });

  it("rejects an empty title", () => {
    expect(() =>
      createGovernancePublicNotice(validInput({ title: "" })),
    ).toThrow("title_required");
  });

  it("rejects an empty summary", () => {
    expect(() =>
      createGovernancePublicNotice(validInput({ summary: "" })),
    ).toThrow("summary_required");
  });

  it("rejects an invalid publication timestamp", () => {
    expect(() =>
      createGovernancePublicNotice(
        validInput({ publishedAt: "not-a-date" }),
      ),
    ).toThrow("published_at_invalid");
  });

  it("rejects an invalid effective timestamp", () => {
    expect(() =>
      createGovernancePublicNotice(
        validInput({ effectiveAt: "not-a-date" }),
      ),
    ).toThrow("effective_at_invalid");
  });

  it("rejects an effective date before publication", () => {
    expect(() =>
      createGovernancePublicNotice(
        validInput({
          publishedAt: "2026-08-19T18:10:00.000Z",
          effectiveAt: "2026-08-19T18:09:00.000Z",
        }),
      ),
    ).toThrow("effective_at_precedes_publication");
  });

  it("validates the canonical public notice chain", () => {
    const snapshot = getGovernancePublicNoticeSnapshot();

    expect(validateGovernancePublicNoticeChain(snapshot.notices)).toBe(true);
  });

  it("rejects duplicate notice ids", () => {
    const first = createGovernancePublicNotice(validInput());

    expect(validateGovernancePublicNoticeChain([first, first])).toBe(false);
  });

  it("rejects a tampered digest", () => {
    const notice = createGovernancePublicNotice(validInput());

    expect(
      validateGovernancePublicNoticeChain([
        {
          ...notice,
          digest: "0".repeat(64),
        },
      ]),
    ).toBe(false);
  });

  it("keeps publication privacy-safe", () => {
    const snapshot = getGovernancePublicNoticeSnapshot();

    expect(snapshot.privacyBoundary.personalDataRequired).toBe(false);
    expect(snapshot.privacyBoundary.credentialsPublishable).toBe(false);
    expect(
      snapshot.privacyBoundary.privateModerationEvidencePublishable,
    ).toBe(false);
    expect(
      snapshot.privacyBoundary.securitySensitiveMaterialPublishable,
    ).toBe(false);
  });

  it("links the latest notice to prior published history", () => {
    const snapshot = getGovernancePublicNoticeSnapshot();

    expect(snapshot.notices.length).toBeGreaterThanOrEqual(2);

    const previous = snapshot.notices[snapshot.notices.length - 2];
    const latest = snapshot.notices[snapshot.notices.length - 1];

    expect(latest.previousNoticeDigest).toBe(previous.digest);
    expect(snapshot.latestNoticeDigest).toBe(latest.digest);
  });

  it("exposes a public GET route", () => {
    const route = read("app/api/governance/public-notice/route.ts");

    expect(route).toContain("export async function GET");
    expect(route).toContain("getGovernancePublicNoticeSnapshot");
  });

  it("does not expose mutation handlers", () => {
    const route = read("app/api/governance/public-notice/route.ts");

    expect(route).not.toMatch(
      /export\s+async\s+function\s+(POST|PUT|PATCH|DELETE)\b/,
    );
  });

  it("does not require authentication for public reading", () => {
    const route = read("app/api/governance/public-notice/route.ts");

    expect(route).not.toContain("requireAdminSession");
    expect(route).not.toContain("requireUserSession");
    expect(route).not.toContain("getServerSession");
  });

  it("does not add a database dependency", () => {
    const route = read("app/api/governance/public-notice/route.ts");
    const core = read("src/core/governance/governancePublicNotice.ts");

    expect(route).not.toMatch(/\bprisma\b/i);
    expect(core).not.toMatch(/\bprisma\b/i);
  });

  it("preserves the constitution publication chain", () => {
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "app/api/governance/constitution-publication/route.ts",
        ),
      ),
    ).toBe(true);

    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "src/core/governance/publicConstitutionArchive.ts",
        ),
      ),
    ).toBe(true);
  });

  it("preserves governance decision publication", () => {
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "app/api/governance/decision-publication/route.ts",
        ),
      ),
    ).toBe(true);

    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "src/core/governance/governanceDecisionPublication.ts",
        ),
      ),
    ).toBe(true);
  });

  it("documents scope limitations explicitly", () => {
    const doc = read(
      "docs/governance/MEGA41_GOVERNANCE_PUBLIC_NOTICE_CHANGE_LOG_BOUNDARY.md",
    );

    expect(doc).toContain("does not claim");
    expect(doc).toContain("dedicated governance database");
  });

  it("keeps the route output free from authority-escalation claims", () => {
    const route = read("app/api/governance/public-notice/route.ts");

    expect(route).not.toContain("legal citizenship");
    expect(route).not.toContain("national government");
    expect(route).not.toContain("sovereign state");
  });
});
