import {
  FYP_SOURCE_REGISTRY,
  getFypSourceById,
  isFypSourceEmbedOnly,
  type FypSourceRegistryItem
} from "./sourceRegistry";

export type FypLicenseProofInput = {
  sourceId: string;
  sourceUrl?: string;
  licenseUrl?: string;
  licenseName?: string;
  attribution?: string;
  commercialReuseAllowed?: boolean;
  embedOnly?: boolean;
  officialChannel?: boolean;
  rightsTag?: string;
};

export type FypLicenseProofResult = {
  ok: boolean;
  source: FypSourceRegistryItem | null;
  errors: string[];
  warnings: string[];
  mode: "download_allowed" | "embed_only" | "blocked";
};

function hasValue(value: unknown): boolean {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function isUnknownRights(input: FypLicenseProofInput): boolean {
  return !hasValue(input.licenseName) && !hasValue(input.licenseUrl) && !hasValue(input.rightsTag);
}

export function validateFypLicenseProof(input: FypLicenseProofInput): FypLicenseProofResult {
  const source = getFypSourceById(input.sourceId);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!source) {
    return {
      ok: false,
      source: null,
      errors: ["unknown_source_id"],
      warnings: [],
      mode: "blocked"
    };
  }

  if (!hasValue(input.sourceUrl)) errors.push("missing_source_url");

  if (source.requiresLicenseProof && isUnknownRights(input)) {
    errors.push("missing_license_or_rights_tag");
  }

  if (source.requiresLicenseProof && input.commercialReuseAllowed !== true && !isFypSourceEmbedOnly(source)) {
    errors.push("unknown_commercial_reuse_status");
  }

  if (source.rightsClass.includes("creative_commons") && !hasValue(input.attribution)) {
    errors.push("missing_attribution_when_required");
  }

  if (source.id === "YOUTUBE_OFFICIAL") {
    if (!input.officialChannel) errors.push("non_official_youtube_source");
    if (input.embedOnly !== true) errors.push("youtube_download_attempt");
  }

  if (source.id === "OFFICIAL_TRAILERS") {
    if (!input.officialChannel) errors.push("non_official_trailer_source");
    if (input.embedOnly !== true) warnings.push("prefer_embed_or_link_for_trailers");
  }

  if (isFypSourceEmbedOnly(source) && input.embedOnly !== true) {
    errors.push("embed_only_source_requested_for_download");
  }

  const ok = errors.length === 0;

  return {
    ok,
    source,
    errors,
    warnings,
    mode: ok ? (isFypSourceEmbedOnly(source) || input.embedOnly ? "embed_only" : "download_allowed") : "blocked"
  };
}

export function validateAllFypSourceLicensePolicies(): boolean {
  return (
    FYP_SOURCE_REGISTRY.length === 48 &&
    FYP_SOURCE_REGISTRY.every((source) =>
      Array.isArray(source.hardRejectRules) &&
      source.hardRejectRules.includes("missing_license_or_rights_tag") &&
      source.hardRejectRules.includes("unknown_commercial_reuse_status") &&
      source.hardRejectRules.includes("missing_source_url") &&
      source.hardRejectRules.includes("missing_attribution_when_required") &&
      source.hardRejectRules.includes("non_official_trailer_source") &&
      source.hardRejectRules.includes("youtube_download_attempt")
    )
  );
}
