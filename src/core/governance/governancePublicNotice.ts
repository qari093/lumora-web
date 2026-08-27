import { createHash } from "node:crypto";

export const GOVERNANCE_PUBLIC_NOTICE_BOUNDARY_VERSION = "mega41-v1" as const;

export type GovernanceNoticeChangeType =
  | "constitutional_publication"
  | "constitutional_amendment"
  | "constitutional_ratification"
  | "governance_decision"
  | "governance_policy_change";

export interface GovernancePublicNoticeInput {
  noticeId: string;
  changeType: GovernanceNoticeChangeType;
  title: string;
  summary: string;
  publishedAt: string;
  effectiveAt: string;
  sourcePath: string;
  decisionRecordPath?: string;
  constitutionVersion?: string;
  previousNoticeDigest?: string;
}

export interface GovernancePublicNotice extends GovernancePublicNoticeInput {
  digestAlgorithm: "sha256";
  digest: string;
}

export interface GovernancePublicNoticeSnapshot {
  boundaryVersion: typeof GOVERNANCE_PUBLIC_NOTICE_BOUNDARY_VERSION;
  publicationMode: "public_read_only";
  appendOnly: true;
  silentRemovalAllowed: false;
  silentRewriteAllowed: false;
  noticeCount: number;
  latestNoticeDigest: string | null;
  notices: GovernancePublicNotice[];
  privacyBoundary: {
    personalDataRequired: false;
    credentialsPublishable: false;
    privateModerationEvidencePublishable: false;
    securitySensitiveMaterialPublishable: false;
  };
  scope: "launch_governance_public_notice_baseline";
}

function clean(value: string): string {
  return value.trim();
}

function assertNonEmpty(value: string, field: string): string {
  const result = clean(value);
  if (!result) throw new Error(`${field}_required`);
  return result;
}

function assertIsoTimestamp(value: string, field: string): string {
  const normalized = assertNonEmpty(value, field);
  const timestamp = Date.parse(normalized);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`${field}_invalid`);
  }

  return normalized;
}

function canonicalNoticePayload(
  input: GovernancePublicNoticeInput,
): GovernancePublicNoticeInput {
  return {
    noticeId: assertNonEmpty(input.noticeId, "notice_id"),
    changeType: input.changeType,
    title: assertNonEmpty(input.title, "title"),
    summary: assertNonEmpty(input.summary, "summary"),
    publishedAt: assertIsoTimestamp(input.publishedAt, "published_at"),
    effectiveAt: assertIsoTimestamp(input.effectiveAt, "effective_at"),
    sourcePath: assertNonEmpty(input.sourcePath, "source_path"),
    ...(input.decisionRecordPath
      ? {
          decisionRecordPath: assertNonEmpty(
            input.decisionRecordPath,
            "decision_record_path",
          ),
        }
      : {}),
    ...(input.constitutionVersion
      ? {
          constitutionVersion: assertNonEmpty(
            input.constitutionVersion,
            "constitution_version",
          ),
        }
      : {}),
    ...(input.previousNoticeDigest
      ? {
          previousNoticeDigest: assertNonEmpty(
            input.previousNoticeDigest,
            "previous_notice_digest",
          ),
        }
      : {}),
  };
}

export function computeGovernanceNoticeDigest(
  input: GovernancePublicNoticeInput,
): string {
  const canonical = canonicalNoticePayload(input);

  return createHash("sha256")
    .update(JSON.stringify(canonical), "utf8")
    .digest("hex");
}

export function createGovernancePublicNotice(
  input: GovernancePublicNoticeInput,
): GovernancePublicNotice {
  const canonical = canonicalNoticePayload(input);

  if (Date.parse(canonical.effectiveAt) < Date.parse(canonical.publishedAt)) {
    throw new Error("effective_at_precedes_publication");
  }

  return {
    ...canonical,
    digestAlgorithm: "sha256",
    digest: computeGovernanceNoticeDigest(canonical),
  };
}

const ROOT_NOTICE = createGovernancePublicNotice({
  noticeId: "mega39-constitution-publication",
  changeType: "constitutional_publication",
  title: "Public constitutional publication baseline",
  summary:
    "Public constitutional publication and append-only history visibility became reachable through the platform governance API.",
  publishedAt: "2026-08-19T15:53:41.000Z",
  effectiveAt: "2026-08-19T15:53:41.000Z",
  sourcePath: "/api/governance/constitution-publication",
  constitutionVersion: "platform-constitution-v1",
});

const DECISION_PUBLICATION_NOTICE = createGovernancePublicNotice({
  noticeId: "mega40-governance-decision-publication",
  changeType: "governance_decision",
  title: "Governance decision publication baseline",
  summary:
    "Consequential governance decision records gained a public read-only accountability publication surface.",
  publishedAt: "2026-08-19T17:42:00.000Z",
  effectiveAt: "2026-08-19T17:42:00.000Z",
  sourcePath: "/api/governance/decision-publication",
  decisionRecordPath: "/api/governance/decision-publication",
  previousNoticeDigest: ROOT_NOTICE.digest,
});

const PUBLIC_NOTICES: readonly GovernancePublicNotice[] = Object.freeze([
  Object.freeze(ROOT_NOTICE),
  Object.freeze(DECISION_PUBLICATION_NOTICE),
]);

export function validateGovernancePublicNoticeChain(
  notices: readonly GovernancePublicNotice[],
): boolean {
  const ids = new Set<string>();

  for (let index = 0; index < notices.length; index += 1) {
    const notice = notices[index];

    if (ids.has(notice.noticeId)) return false;
    ids.add(notice.noticeId);

    const {
      digestAlgorithm: _digestAlgorithm,
      digest,
      ...payload
    } = notice;

    if (digestAlgorithmInvalid(notice.digestAlgorithm)) return false;

    if (computeGovernanceNoticeDigest(payload) !== digest) {
      return false;
    }

    if (index === 0) {
      if (notice.previousNoticeDigest) return false;
      continue;
    }

    const previous = notices[index - 1];

    if (notice.previousNoticeDigest !== previous.digest) {
      return false;
    }

    if (Date.parse(notice.publishedAt) < Date.parse(previous.publishedAt)) {
      return false;
    }
  }

  return true;
}

function digestAlgorithmInvalid(value: string): boolean {
  return value !== "sha256";
}

export function getGovernancePublicNoticeSnapshot(): GovernancePublicNoticeSnapshot {
  if (!validateGovernancePublicNoticeChain(PUBLIC_NOTICES)) {
    throw new Error("governance_public_notice_chain_integrity_failed");
  }

  return {
    boundaryVersion: GOVERNANCE_PUBLIC_NOTICE_BOUNDARY_VERSION,
    publicationMode: "public_read_only",
    appendOnly: true,
    silentRemovalAllowed: false,
    silentRewriteAllowed: false,
    noticeCount: PUBLIC_NOTICES.length,
    latestNoticeDigest:
      PUBLIC_NOTICES.length > 0
        ? PUBLIC_NOTICES[PUBLIC_NOTICES.length - 1].digest
        : null,
    notices: PUBLIC_NOTICES.map((notice) => ({ ...notice })),
    privacyBoundary: {
      personalDataRequired: false,
      credentialsPublishable: false,
      privateModerationEvidencePublishable: false,
      securitySensitiveMaterialPublishable: false,
    },
    scope: "launch_governance_public_notice_baseline",
  };
}
