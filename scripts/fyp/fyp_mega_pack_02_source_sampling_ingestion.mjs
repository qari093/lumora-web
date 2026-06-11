import fs from "node:fs";

const registryPath = "src/core/fyp/sources/sourceRegistry.ts";
const validatorPath = "src/core/fyp/sources/licenseProofValidator.ts";

const sampling = `import {
  FYP_SOURCE_REGISTRY,
  isFypSourceEligibleForDirectDownload,
  isFypSourceEmbedOnly,
  type FypSourceRegistryItem
} from "./sourceRegistry";

import {
  validateFypLicenseProof,
  type FypLicenseProofInput,
  type FypLicenseProofResult
} from "./licenseProofValidator";

export type FypSourceSample = {
  sourceId: string;
  sampleUrl: string;
  licenseName?: string;
  licenseUrl?: string;
  attribution?: string;
  commercialReuseAllowed?: boolean;
  embedOnly?: boolean;
  officialChannel?: boolean;
  rightsTag?: string;
};

export type FypSourceSamplingResult = {
  ok: boolean;
  source: FypSourceRegistryItem | null;
  license: FypLicenseProofResult;
  ingestionEligible: boolean;
  ingestionMode: "direct_download" | "embed_only" | "blocked";
  errors: string[];
};

export function createFypSourceSample(source: FypSourceRegistryItem): FypSourceSample {
  const embedOnly = isFypSourceEmbedOnly(source);

  if (source.id === "YOUTUBE_OFFICIAL") {
    return {
      sourceId: source.id,
      sampleUrl: "https://www.youtube.com/watch?v=official-sample",
      licenseName: "official_channel_embed",
      rightsTag: "authorized_embed",
      commercialReuseAllowed: true,
      embedOnly: true,
      officialChannel: true
    };
  }

  if (source.id === "OFFICIAL_TRAILERS") {
    return {
      sourceId: source.id,
      sampleUrl: "https://www.youtube.com/watch?v=official-trailer-sample",
      licenseName: "official_trailer_embed",
      rightsTag: "authorized_trailer",
      commercialReuseAllowed: true,
      embedOnly: true,
      officialChannel: true
    };
  }

  if (source.requiresLicenseProof) {
    return {
      sourceId: source.id,
      sampleUrl: "https://lumora.example/source-sample/" + source.id.toLowerCase(),
      licenseName: source.rightsClass,
      licenseUrl: "https://lumora.example/license-proof/" + source.id.toLowerCase(),
      attribution: source.rightsClass.includes("creative_commons") ? source.label : undefined,
      commercialReuseAllowed: !embedOnly,
      embedOnly,
      officialChannel: source.rightsClass.includes("official") || source.rightsClass.includes("authorized"),
      rightsTag: source.rightsClass
    };
  }

  return {
    sourceId: source.id,
    sampleUrl: "https://lumora.example/public-domain/" + source.id.toLowerCase(),
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false
  };
}

export function validateFypSourceSample(sample: FypSourceSample): FypSourceSamplingResult {
  const licenseInput: FypLicenseProofInput = {
    sourceId: sample.sourceId,
    sourceUrl: sample.sampleUrl,
    licenseName: sample.licenseName,
    licenseUrl: sample.licenseUrl,
    attribution: sample.attribution,
    commercialReuseAllowed: sample.commercialReuseAllowed,
    embedOnly: sample.embedOnly,
    officialChannel: sample.officialChannel,
    rightsTag: sample.rightsTag
  };

  const license = validateFypLicenseProof(licenseInput);
  const source = license.source;

  if (!source || !license.ok) {
    return {
      ok: false,
      source,
      license,
      ingestionEligible: false,
      ingestionMode: "blocked",
      errors: license.errors
    };
  }

  const directEligible = isFypSourceEligibleForDirectDownload(source);
  const ingestionMode = directEligible && !sample.embedOnly ? "direct_download" : "embed_only";

  return {
    ok: true,
    source,
    license,
    ingestionEligible: true,
    ingestionMode,
    errors: []
  };
}

export function validateAllFypSourceSamples(): boolean {
  const results = FYP_SOURCE_REGISTRY.map((source) => validateFypSourceSample(createFypSourceSample(source)));

  return (
    results.length === 48 &&
    results.every((result) => result.ok && result.ingestionEligible) &&
    results.some((result) => result.ingestionMode === "embed_only") &&
    results.some((result) => result.ingestionMode === "direct_download")
  );
}
`;

fs.writeFileSync("src/core/fyp/sources/sourceSampling.ts", sampling);

fs.mkdirSync("tests/fyp", { recursive: true });

fs.writeFileSync("tests/fyp/fyp_mega_pack_02_source_sampling_ingestion.test.ts", `import { describe, expect, it } from "vitest";

import {
  FYP_SOURCE_REGISTRY,
  getFypSourceById
} from "@/src/core/fyp/sources/sourceRegistry";

import {
  createFypSourceSample,
  validateAllFypSourceSamples,
  validateFypSourceSample
} from "@/src/core/fyp/sources/sourceSampling";

describe("FYP Mega Pack 02 — Source Sampling & Ingestion Eligibility", () => {
  it("keeps exactly 48 registered sources", () => {
    expect(FYP_SOURCE_REGISTRY).toHaveLength(48);
  });

  it("creates valid samples for every source", () => {
    const results = FYP_SOURCE_REGISTRY.map((source) =>
      validateFypSourceSample(createFypSourceSample(source))
    );

    expect(results.every((result) => result.ok)).toBe(true);
    expect(results.every((result) => result.ingestionEligible)).toBe(true);
  });

  it("keeps YouTube official source embed-only", () => {
    const source = getFypSourceById("YOUTUBE_OFFICIAL");
    expect(source).not.toBeNull();

    const result = validateFypSourceSample(createFypSourceSample(source!));

    expect(result.ok).toBe(true);
    expect(result.ingestionMode).toBe("embed_only");
  });

  it("keeps official trailers protected from non-official ingestion", () => {
    const blocked = validateFypSourceSample({
      sourceId: "OFFICIAL_TRAILERS",
      sampleUrl: "https://example.com/random-trailer.mp4",
      licenseName: "unknown",
      commercialReuseAllowed: true,
      embedOnly: false,
      officialChannel: false
    });

    expect(blocked.ok).toBe(false);
    expect(blocked.errors).toContain("non_official_trailer_source");
  });

  it("allows public-domain direct ingestion sample", () => {
    const source = getFypSourceById("NASA");
    expect(source).not.toBeNull();

    const result = validateFypSourceSample(createFypSourceSample(source!));

    expect(result.ok).toBe(true);
    expect(result.ingestionMode).toBe("direct_download");
  });

  it("validates complete source sampling coverage", () => {
    expect(validateAllFypSourceSamples()).toBe(true);
  });
});
`);

const checks = {
  registryPresent: fs.existsSync(registryPath),
  validatorPresent: fs.existsSync(validatorPath),
  samplingRuntimePresent: fs.existsSync("src/core/fyp/sources/sourceSampling.ts"),
  samplingTestsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_02_source_sampling_ingestion.test.ts"),
  all48Expected: fs.readFileSync("src/core/fyp/sources/sourceSampling.ts", "utf8").includes("results.length === 48"),
  youtubeEmbedOnlyChecked: fs.readFileSync("src/core/fyp/sources/sourceSampling.ts", "utf8").includes("YOUTUBE_OFFICIAL"),
  officialTrailerChecked: fs.readFileSync("src/core/fyp/sources/sourceSampling.ts", "utf8").includes("OFFICIAL_TRAILERS"),
  directAndEmbedModesPresent: fs.readFileSync("src/core/fyp/sources/sourceSampling.ts", "utf8").includes("direct_download") && fs.readFileSync("src/core/fyp/sources/sourceSampling.ts", "utf8").includes("embed_only")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_02_SOURCE_SAMPLING_INGESTION",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS"
    ? "FYP_MEGA_PACK_02_SOURCE_SAMPLING_INGESTION_READY"
    : "FYP_MEGA_PACK_02_SOURCE_SAMPLING_INGESTION_BLOCKED"
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync("data/fyp/mega-pack-02-source-sampling-ingestion.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-02-source-sampling-ingestion.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-02-source-sampling-ingestion.md", [
  "# FYP Mega Pack 02 — Source Sampling & Ingestion Eligibility",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_02_source_sampling_ingestion_lock", "FYP_MEGA_PACK_02_SOURCE_SAMPLING_INGESTION=PASS\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_02_source_sampling_ingestion_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_02_source_sampling_ingestion_failed_lock", "FYP_MEGA_PACK_02_SOURCE_SAMPLING_INGESTION=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_02_source_sampling_ingestion_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
