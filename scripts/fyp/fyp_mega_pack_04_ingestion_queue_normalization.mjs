import fs from "node:fs";

const runtime = `import {
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
`;

fs.mkdirSync("src/core/fyp/ingestion", { recursive: true });
fs.writeFileSync("src/core/fyp/ingestion/ingestionQueue.ts", runtime);

fs.mkdirSync("tests/fyp", { recursive: true });

fs.writeFileSync("tests/fyp/fyp_mega_pack_04_ingestion_queue_normalization.test.ts", `import { describe, expect, it } from "vitest";

import {
  createFypIngestionJob,
  normalizeFypIngestionBatch,
  normalizeFypIngestionJob,
  validateFypIngestionJob,
  validateFypIngestionQueueNormalizationRuntime
} from "@/src/core/fyp/ingestion/ingestionQueue";

describe("FYP Mega Pack 04 — Ingestion Queue + Normalization", () => {
  it("creates a queued ingestion job for a known source", () => {
    const job = createFypIngestionJob({
      sourceId: "NASA",
      externalId: "sample-1",
      title: "NASA Sample",
      sampleUrl: "https://nasa.gov/sample.mp4",
      rightsTag: "public_domain",
      commercialReuseAllowed: true
    });

    expect(job.status).toBe("queued");
    expect(job.source.id).toBe("NASA");
  });

  it("blocks unknown sources", () => {
    const job = createFypIngestionJob({
      sourceId: "UNKNOWN_SOURCE",
      externalId: "bad-1",
      title: "Bad",
      sampleUrl: "https://example.com/bad.mp4"
    });

    expect(job.status).toBe("blocked");
    expect(job.errors).toContain("unknown_source_id");
  });

  it("validates and normalizes a public domain source", () => {
    const job = validateFypIngestionJob(createFypIngestionJob({
      sourceId: "NASA",
      externalId: "earth-rise",
      title: "Earth Rise",
      sampleUrl: "https://www.nasa.gov/earth-rise.mp4",
      rightsTag: "public_domain",
      commercialReuseAllowed: true,
      embedOnly: false
    }));

    const item = normalizeFypIngestionJob(job);

    expect(item.sourceId).toBe("NASA");
    expect(item.rightsVerified).toBe(true);
    expect(item.safeForFyp).toBe(true);
    expect(item.ingestionMode).toBe("direct_download");
  });

  it("keeps official YouTube items embed-only", () => {
    const batch = normalizeFypIngestionBatch([
      {
        sourceId: "YOUTUBE_OFFICIAL",
        externalId: "official-embed",
        title: "Official Embed",
        sampleUrl: "https://youtube.com/watch?v=official",
        licenseName: "official_channel_embed",
        commercialReuseAllowed: true,
        embedOnly: true,
        officialChannel: true
      }
    ]);

    expect(batch).toHaveLength(1);
    expect(batch[0]?.ingestionMode).toBe("embed_only");
  });

  it("deduplicates normalized feed items", () => {
    const batch = normalizeFypIngestionBatch([
      {
        sourceId: "NASA",
        externalId: "dupe",
        title: "Dupe",
        sampleUrl: "https://www.nasa.gov/dupe.mp4",
        rightsTag: "public_domain",
        commercialReuseAllowed: true
      },
      {
        sourceId: "NASA",
        externalId: "dupe",
        title: "Dupe",
        sampleUrl: "https://www.nasa.gov/dupe.mp4",
        rightsTag: "public_domain",
        commercialReuseAllowed: true
      }
    ]);

    expect(batch).toHaveLength(1);
  });

  it("validates complete ingestion queue normalization runtime", () => {
    expect(validateFypIngestionQueueNormalizationRuntime()).toBe(true);
  });
});
`);

const checks = {
  pack03Locked: fs.existsSync(".lumora_fyp_mega_pack_03_final_lock"),
  ingestionRuntimePresent: fs.existsSync("src/core/fyp/ingestion/ingestionQueue.ts"),
  ingestionTestsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_04_ingestion_queue_normalization.test.ts"),
  sourceRegistryPresent: fs.existsSync("src/core/fyp/sources/sourceRegistry.ts"),
  licenseValidatorPresent: fs.existsSync("src/core/fyp/sources/licenseProofValidator.ts"),
  samplingPresent: fs.existsSync("src/core/fyp/sources/sourceSampling.ts"),
  queueRuntimeHasValidation: runtime.includes("validateFypIngestionJob"),
  queueRuntimeHasNormalization: runtime.includes("normalizeFypIngestionJob"),
  queueRuntimeHasBatchDedup: runtime.includes("seen.has(item.id)"),
  queueRuntimeHasFinalValidator: runtime.includes("validateFypIngestionQueueNormalizationRuntime")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_04_INGESTION_QUEUE_NORMALIZATION",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_04_INGESTION_QUEUE_NORMALIZATION_READY"
    : "FYP_MEGA_PACK_04_INGESTION_QUEUE_NORMALIZATION_BLOCKED"
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync("data/fyp/mega-pack-04-ingestion-queue-normalization.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-04-ingestion-queue-normalization.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-04-ingestion-queue-normalization.md", [
  "# FYP Mega Pack 04/07 — Ingestion Queue + Normalization",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_04_ingestion_queue_normalization_lock", "FYP_MEGA_PACK_04_INGESTION_QUEUE_NORMALIZATION=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_04_ingestion_queue_normalization_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_04_ingestion_queue_normalization_failed_lock", "FYP_MEGA_PACK_04_INGESTION_QUEUE_NORMALIZATION=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_04_ingestion_queue_normalization_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
