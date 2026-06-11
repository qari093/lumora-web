import {
  getFypSourceById,
  type FypSourceRegistryItem
} from "../sources/sourceRegistry";

import {
  validateFypLicenseProof,
  type FypLicenseProofInput
} from "../sources/licenseProofValidator";

import {
  validateFypSourceSample,
  type FypSourceSample
} from "../sources/sourceSampling";

export type FypIngestionJobStatus = "queued" | "validated" | "normalized" | "blocked";

export type FypIngestionJobInput = FypSourceSample & {
  externalId: string;
  title: string;
  creator?: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
  mimeType?: string;
};

export type FypIngestionJob = {
  id: string;
  source: FypSourceRegistryItem;
  status: FypIngestionJobStatus;
  input: FypIngestionJobInput;
  errors: string[];
  queuedAt: string;
};

export type FypNormalizedFeedItem = {
  id: string;
  sourceId: string;
  sourceLabel: string;
  title: string;
  creator: string;
  url: string;
  licenseName: string;
  attribution: string;
  ingestionMode: "direct_download" | "embed_only";
  durationSeconds: number;
  width: number;
  height: number;
  mimeType: string;
  rightsVerified: boolean;
  safeForFyp: boolean;
};

function stableId(parts: string[]): string {
  return parts
    .join(":")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function createFypIngestionJob(input: FypIngestionJobInput): FypIngestionJob {
  const source = getFypSourceById(input.sourceId);
  const id = stableId(["fyp-ingest", input.sourceId, input.externalId]);

  if (!source) {
    return {
      id,
      source: {
        id: "UNKNOWN",
        index: 0,
        label: "Unknown",
        rightsClass: "mixed_license",
        ingestionMode: "blocked",
        category: "archive",
        enabled: false,
        requiresLicenseProof: true,
        hardRejectRules: ["unknown_source_id"]
      },
      status: "blocked",
      input,
      errors: ["unknown_source_id"],
      queuedAt: new Date(0).toISOString()
    };
  }

  return {
    id,
    source,
    status: "queued",
    input,
    errors: [],
    queuedAt: new Date(0).toISOString()
  };
}

export function validateFypIngestionJob(job: FypIngestionJob): FypIngestionJob {
  if (job.status === "blocked") return job;

  const licenseInput: FypLicenseProofInput = {
    sourceId: job.input.sourceId,
    sourceUrl: job.input.sampleUrl,
    licenseUrl: job.input.licenseUrl,
    licenseName: job.input.licenseName,
    attribution: job.input.attribution,
    commercialReuseAllowed: job.input.commercialReuseAllowed,
    embedOnly: job.input.embedOnly,
    officialChannel: job.input.officialChannel,
    rightsTag: job.input.rightsTag
  };

  const license = validateFypLicenseProof(licenseInput);
  const sampling = validateFypSourceSample(job.input);

  const errors = [...license.errors, ...sampling.errors];

  if (!license.ok || !sampling.ok || errors.length > 0) {
    return {
      ...job,
      status: "blocked",
      errors: Array.from(new Set(errors))
    };
  }

  return {
    ...job,
    status: "validated",
    errors: []
  };
}

export function normalizeFypIngestionJob(job: FypIngestionJob): FypNormalizedFeedItem {
  const validated = validateFypIngestionJob(job);

  if (validated.status !== "validated") {
    throw new Error("FYP_INGESTION_JOB_NOT_VALIDATED");
  }

  const ingestionMode = validated.input.embedOnly ? "embed_only" : "direct_download";

  return {
    id: stableId(["fyp-feed", validated.input.sourceId, validated.input.externalId]),
    sourceId: validated.source.id,
    sourceLabel: validated.source.label,
    title: validated.input.title.trim() || "Untitled Lumora Source",
    creator: validated.input.creator?.trim() || validated.source.label,
    url: validated.input.sampleUrl,
    licenseName: validated.input.licenseName || validated.input.rightsTag || validated.source.rightsClass,
    attribution: validated.input.attribution || validated.source.label,
    ingestionMode,
    durationSeconds: Math.max(1, Math.min(validated.input.durationSeconds ?? 30, 900)),
    width: Math.max(320, Math.min(validated.input.width ?? 1280, 3840)),
    height: Math.max(240, Math.min(validated.input.height ?? 720, 2160)),
    mimeType: validated.input.mimeType || (ingestionMode === "embed_only" ? "text/html" : "video/mp4"),
    rightsVerified: true,
    safeForFyp: true
  };
}

export function normalizeFypIngestionBatch(inputs: FypIngestionJobInput[]): FypNormalizedFeedItem[] {
  const seen = new Set<string>();

  return inputs
    .map(createFypIngestionJob)
    .map(validateFypIngestionJob)
    .filter((job) => job.status === "validated")
    .map(normalizeFypIngestionJob)
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
}

export function validateFypIngestionQueueNormalizationRuntime(): boolean {
  const batch = normalizeFypIngestionBatch([
    {
      sourceId: "NASA",
      externalId: "earth-rise",
      title: "Earth Rise",
      sampleUrl: "https://www.nasa.gov/earth-rise.mp4",
      rightsTag: "public_domain",
      commercialReuseAllowed: true,
      embedOnly: false
    },
    {
      sourceId: "YOUTUBE_OFFICIAL",
      externalId: "official-trailer",
      title: "Official Trailer",
      sampleUrl: "https://www.youtube.com/watch?v=official",
      licenseName: "official_channel_embed",
      commercialReuseAllowed: true,
      embedOnly: true,
      officialChannel: true
    }
  ]);

  return (
    batch.length === 2 &&
    batch.every((item) => item.rightsVerified && item.safeForFyp) &&
    batch.some((item) => item.ingestionMode === "direct_download") &&
    batch.some((item) => item.ingestionMode === "embed_only")
  );
}
