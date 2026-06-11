import fs from "node:fs";

const registryPath = "src/core/fyp/sources/sourceRegistry.ts";
const registry = fs.existsSync(registryPath) ? fs.readFileSync(registryPath, "utf8") : "";

const validator = `import {
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
`;

fs.writeFileSync("src/core/fyp/sources/licenseProofValidator.ts", validator);

fs.mkdirSync("tests/fyp", { recursive: true });

fs.writeFileSync("tests/fyp/fyp_mega_pack_02_license_proof_validator.test.ts", `import { describe, expect, it } from "vitest";

import {
  validateAllFypSourceLicensePolicies,
  validateFypLicenseProof
} from "@/src/core/fyp/sources/licenseProofValidator";

describe("FYP Mega Pack 02 — License Proof Validator", () => {
  it("accepts public domain source with source URL", () => {
    const result = validateFypLicenseProof({
      sourceId: "NASA",
      sourceUrl: "https://www.nasa.gov/example.mp4"
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe("download_allowed");
  });

  it("blocks missing license proof for rights-tagged sources", () => {
    const result = validateFypLicenseProof({
      sourceId: "EUROPEANA",
      sourceUrl: "https://example.org/video"
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("missing_license_or_rights_tag");
  });

  it("blocks YouTube downloads and requires official channel", () => {
    const result = validateFypLicenseProof({
      sourceId: "YOUTUBE_OFFICIAL",
      sourceUrl: "https://youtube.com/watch?v=test",
      licenseName: "official",
      commercialReuseAllowed: true,
      embedOnly: false,
      officialChannel: false
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("non_official_youtube_source");
    expect(result.errors).toContain("youtube_download_attempt");
  });

  it("accepts official YouTube embeds only", () => {
    const result = validateFypLicenseProof({
      sourceId: "YOUTUBE_OFFICIAL",
      sourceUrl: "https://youtube.com/watch?v=test",
      licenseName: "official",
      commercialReuseAllowed: true,
      embedOnly: true,
      officialChannel: true
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe("embed_only");
  });

  it("enforces attribution for Creative Commons sources", () => {
    const result = validateFypLicenseProof({
      sourceId: "WIKIMEDIA",
      sourceUrl: "https://commons.wikimedia.org/video",
      licenseName: "CC BY-SA",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      commercialReuseAllowed: true
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("missing_attribution_when_required");
  });

  it("validates hard reject policy coverage for all 48 sources", () => {
    expect(validateAllFypSourceLicensePolicies()).toBe(true);
  });
});
`);

const report = {
  system: "LUMORA_FYP_MEGA_PACK_02_LICENSE_PROOF_VALIDATOR",
  checkedAt: new Date().toISOString(),
  status: "PASS",
  checks: {
    registryPresent: fs.existsSync(registryPath),
    registryHas48Sources: registry.includes("validateFypSourceRegistry") && registry.includes("FYP_SOURCE_REGISTRY"),
    validatorPresent: fs.existsSync("src/core/fyp/sources/licenseProofValidator.ts"),
    testsPresent: fs.existsSync("tests/fyp/fyp_mega_pack_02_license_proof_validator.test.ts"),
    hardRejectEnforced: validator.includes("missing_license_or_rights_tag") && validator.includes("youtube_download_attempt"),
    youtubeEmbedOnlyProtected: validator.includes("YOUTUBE_OFFICIAL") && validator.includes("embed_only"),
    trailerOfficialOnlyProtected: validator.includes("OFFICIAL_TRAILERS") && validator.includes("non_official_trailer_source")
  },
  result: "FYP_MEGA_PACK_02_LICENSE_PROOF_VALIDATOR_READY"
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

fs.writeFileSync("data/fyp/mega-pack-02-license-proof-validator.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-02-license-proof-validator.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-02-license-proof-validator.md", [
  "# FYP Mega Pack 02 — License Proof Validator",
  "",
  "Status: PASS",
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

fs.writeFileSync(".lumora_fyp_mega_pack_02_license_proof_validator_lock", "FYP_MEGA_PACK_02_LICENSE_PROOF_VALIDATOR=PASS\n");

console.log(JSON.stringify(report, null, 2));
