import {
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
