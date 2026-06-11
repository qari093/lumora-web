import fs from "node:fs";
import { execSync } from "node:child_process";

const exists = (p) => fs.existsSync(p);
const read = (p) => exists(p) ? fs.readFileSync(p, "utf8") : "";

const run = (cmd, log) => {
  try {
    const out = execSync(cmd, { stdio: "pipe", encoding: "utf8", timeout: 1000 * 60 * 12 });
    fs.writeFileSync(log, out);
    return true;
  } catch (error) {
    fs.writeFileSync(log, `${error.stdout || ""}\n${error.stderr || ""}`);
    return false;
  }
};

fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

const typecheck = run("pnpm -s tsc --noEmit", "/tmp/fyp_mega_pack_02_tsc.log");
const licenseTests = run(
  "pnpm -s vitest run tests/fyp/fyp_mega_pack_02_license_proof_validator.test.ts --reporter verbose",
  "/tmp/fyp_mega_pack_02_license_tests.log"
);
const samplingTests = run(
  "pnpm -s vitest run tests/fyp/fyp_mega_pack_02_source_sampling_ingestion.test.ts --reporter verbose",
  "/tmp/fyp_mega_pack_02_sampling_tests.log"
);

const registry = read("src/core/fyp/sources/sourceRegistry.ts");
const validator = read("src/core/fyp/sources/licenseProofValidator.ts");
const sampling = read("src/core/fyp/sources/sourceSampling.ts");

const checks = {
  prerequisiteLocks: {
    rightsAudit: exists(".lumora_fyp_mega_pack_02_video_sources_rights_lock"),
    sourceRegistryRuntime: exists(".lumora_fyp_mega_pack_02_source_registry_runtime_lock"),
    licenseProofValidator: exists(".lumora_fyp_mega_pack_02_license_proof_validator_lock"),
    sourceSamplingIngestion: exists(".lumora_fyp_mega_pack_02_source_sampling_ingestion_lock")
  },
  artifacts: {
    registryFile: exists("src/core/fyp/sources/sourceRegistry.ts"),
    validatorFile: exists("src/core/fyp/sources/licenseProofValidator.ts"),
    samplingFile: exists("src/core/fyp/sources/sourceSampling.ts"),
    registryData: exists("data/fyp/source-registry.json")
  },
  sourceRegistry: {
    has48SourceGuard: registry.includes("FYP_SOURCE_REGISTRY.length === 48"),
    hasUniqueLookup: registry.includes("getFypSourceById"),
    hasDirectEligibility: registry.includes("isFypSourceEligibleForDirectDownload"),
    hasEmbedOnlyGuard: registry.includes("isFypSourceEmbedOnly"),
    hasYouTubeOfficial: registry.includes("YOUTUBE_OFFICIAL"),
    hasOfficialTrailers: registry.includes("OFFICIAL_TRAILERS")
  },
  rightsAndLicense: {
    validatesProof: validator.includes("validateFypLicenseProof"),
    enforcesMissingLicense: validator.includes("missing_license_or_rights_tag"),
    enforcesCommercialReuse: validator.includes("unknown_commercial_reuse_status"),
    enforcesAttribution: validator.includes("missing_attribution_when_required"),
    blocksYouTubeDownload: validator.includes("youtube_download_attempt"),
    blocksNonOfficialTrailer: validator.includes("non_official_trailer_source"),
    validatesAllPolicies: validator.includes("validateAllFypSourceLicensePolicies")
  },
  samplingAndIngestion: {
    createsSamples: sampling.includes("createFypSourceSample"),
    validatesSamples: sampling.includes("validateFypSourceSample"),
    validatesAll48: sampling.includes("results.length === 48"),
    hasDirectDownloadMode: sampling.includes("direct_download"),
    hasEmbedOnlyMode: sampling.includes("embed_only"),
    hasBlockedMode: sampling.includes("blocked")
  },
  tests: {
    typecheck,
    licenseTests,
    samplingTests
  }
};

const flatten = (obj) =>
  Object.values(obj).flatMap((value) =>
    value && typeof value === "object" && !Array.isArray(value) ? flatten(value) : [value]
  );

const status = flatten(checks).every(Boolean) ? "PASS" : "FAIL";

const report = {
  system: "LUMORA_FYP_MEGA_PACK_02_FULL_AUDIT_SEAL",
  checkedAt: new Date().toISOString(),
  status,
  megaPack: "02/07",
  name: "Video Sources Rights Registry And Ingestion Guard",
  checks,
  logs: {
    typecheck: "/tmp/fyp_mega_pack_02_tsc.log",
    licenseTests: "/tmp/fyp_mega_pack_02_license_tests.log",
    samplingTests: "/tmp/fyp_mega_pack_02_sampling_tests.log"
  },
  result: status === "PASS"
    ? "FYP_MEGA_PACK_02_FULLY_AUDITED_READY"
    : "FYP_MEGA_PACK_02_FULL_AUDIT_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-02-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-02-full-audit-seal.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-02-full-audit-seal.md", [
  "# FYP Mega Pack 02/07 — Full Audit Seal",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_02_full_audit_lock", "FYP_MEGA_PACK_02_FULL_AUDIT=PASS\n");
  fs.writeFileSync(".lumora_fyp_mega_pack_02_production_seal", [
    "FYP_MEGA_PACK_02_STATUS=PASS",
    "FYP_MEGA_PACK_02_SOURCE_REGISTRY=PASS",
    "FYP_MEGA_PACK_02_LICENSE_PROOF=PASS",
    "FYP_MEGA_PACK_02_SOURCE_SAMPLING=PASS",
    "FYP_MEGA_PACK_02_TYPECHECK=PASS",
    "FYP_MEGA_PACK_02_TESTS=PASS",
    "FYP_MEGA_PACK_02_PRODUCTION_SEAL=PASS",
    ""
  ].join("\n"));
  fs.writeFileSync(".lumora_fyp_mega_pack_02_final_lock", [
    "FYP_MEGA_PACK_02_FULL_AUDIT=PASS",
    "FYP_MEGA_PACK_02_PRODUCTION_SEAL=PASS",
    "FYP_MEGA_PACK_02_FINAL_LOCK=PASS",
    ""
  ].join("\n"));
  try { fs.unlinkSync(".lumora_fyp_mega_pack_02_full_audit_failed_lock"); } catch {}
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_02_full_audit_failed_lock", "FYP_MEGA_PACK_02_FULL_AUDIT=FAIL\n");
  try { fs.unlinkSync(".lumora_fyp_mega_pack_02_full_audit_lock"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_02_production_seal"); } catch {}
  try { fs.unlinkSync(".lumora_fyp_mega_pack_02_final_lock"); } catch {}
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
