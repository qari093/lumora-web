import { createHash } from "node:crypto";

export const PUBLIC_CONSTITUTION_ARCHIVE_BOUNDARY_VERSION =
  "mega39-v1" as const;

export const PUBLIC_CONSTITUTION_SCHEMA_VERSION = "1" as const;

export type PublicConstitutionPublicationStatus =
  | "published"
  | "superseded";

export interface PublicConstitutionArchiveEntry {
  version: string;
  status: PublicConstitutionPublicationStatus;
  effectiveDate: string;
  publishedAt: string;
  documentPath: string;
  publicChangeRecord: string;
  previousVersion: string | null;
  previousDigest: string | null;
  digest: string;
}

export interface PublicConstitutionArchiveSnapshot {
  boundaryVersion: typeof PUBLIC_CONSTITUTION_ARCHIVE_BOUNDARY_VERSION;
  schemaVersion: typeof PUBLIC_CONSTITUTION_SCHEMA_VERSION;
  public: true;
  appendOnly: true;
  silentRewriteAllowed: false;
  deletionOfPublishedHistoryAllowed: false;
  currentVersion: string;
  currentDigest: string;
  archiveEntryCount: number;
  entries: readonly PublicConstitutionArchiveEntry[];
  privacySafeguards: {
    personalDataPublished: false;
    securitySensitiveDataPublished: false;
    privateModerationEvidencePublished: false;
  };
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nested]) => [key, normalize(nested)]),
    );
  }

  return value;
}

export function computePublicConstitutionArchiveDigest(input: {
  version: string;
  effectiveDate: string;
  publishedAt: string;
  documentPath: string;
  publicChangeRecord: string;
  previousVersion: string | null;
  previousDigest: string | null;
}): string {
  const canonical = JSON.stringify(normalize(input));

  return createHash("sha256")
    .update(canonical, "utf8")
    .digest("hex");
}

const ROOT_INPUT = {
  version: "platform-constitution-v1",
  effectiveDate: "2026-08-19",
  publishedAt: "2026-08-19",
  documentPath: "/api/governance/constitution-publication",
  publicChangeRecord:
    "Initial public constitutional publication baseline for the Lumora platform governance framework.",
  previousVersion: null,
  previousDigest: null,
} as const;

const ROOT_DIGEST = computePublicConstitutionArchiveDigest(ROOT_INPUT);

const PUBLIC_ARCHIVE: readonly PublicConstitutionArchiveEntry[] =
  Object.freeze([
    Object.freeze({
      ...ROOT_INPUT,
      status: "published" as const,
      digest: ROOT_DIGEST,
    }),
  ]);

export function validatePublicConstitutionArchive(
  entries: readonly PublicConstitutionArchiveEntry[],
): boolean {
  if (entries.length === 0) {
    return false;
  }

  const versions = new Set<string>();

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];

    if (!entry.version.trim()) return false;
    if (!entry.effectiveDate.trim()) return false;
    if (!entry.publishedAt.trim()) return false;
    if (!entry.documentPath.trim()) return false;
    if (!entry.publicChangeRecord.trim()) return false;

    if (versions.has(entry.version)) {
      return false;
    }

    versions.add(entry.version);

    const expectedDigest = computePublicConstitutionArchiveDigest({
      version: entry.version,
      effectiveDate: entry.effectiveDate,
      publishedAt: entry.publishedAt,
      documentPath: entry.documentPath,
      publicChangeRecord: entry.publicChangeRecord,
      previousVersion: entry.previousVersion,
      previousDigest: entry.previousDigest,
    });

    if (entry.digest !== expectedDigest) {
      return false;
    }

    if (index === 0) {
      if (
        entry.previousVersion !== null ||
        entry.previousDigest !== null
      ) {
        return false;
      }

      continue;
    }

    const previous = entries[index - 1];

    if (entry.previousVersion !== previous.version) {
      return false;
    }

    if (entry.previousDigest !== previous.digest) {
      return false;
    }
  }

  return true;
}

export function getPublicConstitutionArchiveSnapshot():
  PublicConstitutionArchiveSnapshot {
  if (!validatePublicConstitutionArchive(PUBLIC_ARCHIVE)) {
    throw new Error("public constitution archive integrity validation failed");
  }

  const current = PUBLIC_ARCHIVE[PUBLIC_ARCHIVE.length - 1];

  return Object.freeze({
    boundaryVersion: PUBLIC_CONSTITUTION_ARCHIVE_BOUNDARY_VERSION,
    schemaVersion: PUBLIC_CONSTITUTION_SCHEMA_VERSION,
    public: true as const,
    appendOnly: true as const,
    silentRewriteAllowed: false as const,
    deletionOfPublishedHistoryAllowed: false as const,
    currentVersion: current.version,
    currentDigest: current.digest,
    archiveEntryCount: PUBLIC_ARCHIVE.length,
    entries: PUBLIC_ARCHIVE,
    privacySafeguards: Object.freeze({
      personalDataPublished: false as const,
      securitySensitiveDataPublished: false as const,
      privateModerationEvidencePublished: false as const,
    }),
  });
}
