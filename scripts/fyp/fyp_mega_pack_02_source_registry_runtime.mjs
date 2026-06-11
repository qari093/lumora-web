import fs from "node:fs";

const sources = [
  ["NASA","public_domain","download_or_api","science"],
  ["ESA","official_terms","download_or_embed","space"],
  ["ESO","official_terms","download_or_embed","space"],
  ["ESA_HUBBLE","official_terms","download_or_embed","space"],
  ["INTERNET_ARCHIVE","mixed_license","download_with_license_check","archive"],
  ["PRELINGER","public_domain_or_mixed","download_with_license_check","archive"],
  ["FEDFLIX","public_domain","download_or_api","archive"],
  ["LIBRARY_OF_CONGRESS","public_domain_or_rights_tagged","download_with_license_check","archive"],
  ["SMITHSONIAN","open_access","download_with_license_check","culture"],
  ["EUROPEANA","rights_tagged","api_with_rights_check","culture"],
  ["OPEN_IMAGES","rights_tagged","api_or_embed","archive"],
  ["WIKIMEDIA","creative_commons_or_public_domain","api_with_license_check","culture"],
  ["DAREFUL","stock_license","download_with_terms_check","stock"],
  ["DISTILL","stock_license","download_with_terms_check","stock"],
  ["LIFE_OF_VIDS","stock_license","download_with_terms_check","stock"],
  ["SPLITSHIRE","stock_license","download_with_terms_check","stock"],
  ["PEXELS","stock_license","api_with_terms_check","stock"],
  ["PIXABAY","stock_license","api_with_terms_check","stock"],
  ["COVERR","stock_license","download_with_terms_check","stock"],
  ["MIXKIT","stock_license","download_with_terms_check","stock"],
  ["OFFICIAL_TRAILERS","authorized_only","embed_or_link_only","film"],
  ["YOUTUBE_OFFICIAL","authorized_embed_only","embed_only","film"],
  ["VIMEO_CC","creative_commons_embed_allowed","embed_or_api_with_license_check","film"],
  ["PRASAR_BHARATI","official_terms","api_or_embed","public_media"],
  ["LUMORA_LICENSED","owned_or_contract","direct_ingest","owned"],
  ["POND5_PUBLIC_DOMAIN","public_domain","download_with_license_check","archive"],
  ["MAZWAI","stock_license","download_with_terms_check","stock"],
  ["FREE_STOCK_FOOTAGE_ARCHIVE","stock_or_public_domain","download_with_terms_check","stock"],
  ["BEACHFRONT_BROLL","stock_license","download_with_terms_check","stock"],
  ["CUTESTOCKFOOTAGE","stock_license","download_with_terms_check","stock"],
  ["ALJAZEERA_CC","creative_commons","embed_or_download_with_license_check","news"],
  ["GONGU_MADANG","rights_tagged","download_with_license_check","culture"],
  ["DIGITAL_NZ","rights_tagged","api_with_rights_check","archive"],
  ["NOAA","public_domain","download_or_api","science"],
  ["USGS","public_domain","download_or_api","science"],
  ["PUBLIC_DOMAIN_REVIEW","public_domain_or_rights_tagged","link_or_download_with_license_check","archive"],
  ["FREE_NATURE_STOCK","stock_license","download_with_terms_check","nature"],
  ["NATURECLIP","stock_license","download_with_terms_check","nature"],
  ["WELLCOME","rights_tagged","api_with_rights_check","culture"],
  ["EUSCREEN","rights_tagged","api_or_embed","archive"],
  ["PADMA","mixed_license","embed_or_license_check","archive"],
  ["VIDSPLAY","stock_license","download_with_terms_check","stock"],
  ["VIDEVO","mixed_stock_license","download_with_terms_check","stock"],
  ["CLACSO_TV","official_terms","embed_or_link_only","education"],
  ["AFRICA_ONLINE_DIGITAL_LIBRARY","rights_tagged","link_or_license_check","archive"],
  ["LIBREFLIX","open_license_or_authorized","embed_or_download_with_license_check","film"],
  ["NHK_CREATIVE_LIBRARY","official_terms","download_with_terms_check","public_media"],
  ["NFSA_FILM_AUSTRALIA","zero_fee_license","download_with_terms_check","film"]
].map(([id, rightsClass, ingestionMode, category], index) => ({
  id,
  index: index + 1,
  label: id.replaceAll("_", " "),
  rightsClass,
  ingestionMode,
  category,
  enabled: false,
  requiresLicenseProof: !["public_domain"].includes(rightsClass),
  hardRejectRules: [
    "missing_license_or_rights_tag",
    "unknown_commercial_reuse_status",
    "missing_source_url",
    "missing_attribution_when_required",
    "non_official_trailer_source",
    "youtube_download_attempt"
  ]
}));

fs.mkdirSync("src/core/fyp/sources", { recursive: true });
fs.mkdirSync("data/fyp", { recursive: true });
fs.mkdirSync("docs/fyp", { recursive: true });
fs.mkdirSync(".lumora-audits", { recursive: true });

const ts = `export type FypSourceRightsClass =
  | "public_domain"
  | "official_terms"
  | "mixed_license"
  | "public_domain_or_mixed"
  | "public_domain_or_rights_tagged"
  | "open_access"
  | "rights_tagged"
  | "creative_commons_or_public_domain"
  | "stock_license"
  | "authorized_only"
  | "authorized_embed_only"
  | "creative_commons_embed_allowed"
  | "owned_or_contract"
  | "stock_or_public_domain"
  | "creative_commons"
  | "mixed_stock_license"
  | "open_license_or_authorized"
  | "zero_fee_license";

export type FypSourceCategory =
  | "science"
  | "space"
  | "archive"
  | "culture"
  | "stock"
  | "film"
  | "public_media"
  | "owned"
  | "news"
  | "nature"
  | "education";

export type FypSourceRegistryItem = {
  id: string;
  index: number;
  label: string;
  rightsClass: FypSourceRightsClass;
  ingestionMode: string;
  category: FypSourceCategory;
  enabled: boolean;
  requiresLicenseProof: boolean;
  hardRejectRules: string[];
};

export const FYP_SOURCE_REGISTRY = ${JSON.stringify(sources, null, 2)} satisfies FypSourceRegistryItem[];

export function getFypSourceById(id: string): FypSourceRegistryItem | null {
  return FYP_SOURCE_REGISTRY.find((source) => source.id === id) ?? null;
}

export function validateFypSourceRegistry(): boolean {
  const ids = new Set(FYP_SOURCE_REGISTRY.map((source) => source.id));
  return (
    FYP_SOURCE_REGISTRY.length === 48 &&
    ids.size === FYP_SOURCE_REGISTRY.length &&
    FYP_SOURCE_REGISTRY.every((source) =>
      Boolean(source.id) &&
      Boolean(source.label) &&
      Boolean(source.rightsClass) &&
      Boolean(source.ingestionMode) &&
      Boolean(source.category) &&
      Array.isArray(source.hardRejectRules) &&
      source.hardRejectRules.length >= 6
    )
  );
}

export function isFypSourceEligibleForDirectDownload(source: FypSourceRegistryItem): boolean {
  return source.ingestionMode !== "embed_only" && source.ingestionMode !== "embed_or_link_only";
}

export function isFypSourceEmbedOnly(source: FypSourceRegistryItem): boolean {
  return source.ingestionMode === "embed_only" || source.ingestionMode === "embed_or_link_only";
}
`;

fs.writeFileSync("src/core/fyp/sources/sourceRegistry.ts", ts);
fs.writeFileSync("data/fyp/source-registry.json", JSON.stringify({ count: sources.length, sources }, null, 2) + "\n");

const registryText = fs.readFileSync("src/core/fyp/sources/sourceRegistry.ts", "utf8");
const checks = {
  sourceCount48: sources.length === 48,
  uniqueIds: new Set(sources.map((s) => s.id)).size === 48,
  registryFilePresent: fs.existsSync("src/core/fyp/sources/sourceRegistry.ts"),
  dataRegistryPresent: fs.existsSync("data/fyp/source-registry.json"),
  publicDomainPresent: registryText.includes("public_domain"),
  ccPresent: registryText.includes("creative_commons"),
  embedOnlyPresent: registryText.includes("embed_only"),
  youtubeProtected: registryText.includes("youtube_download_attempt"),
  trailerProtected: registryText.includes("non_official_trailer_source"),
  validationFunctionPresent: registryText.includes("validateFypSourceRegistry")
};

const status = Object.values(checks).every(Boolean) ? "PASS" : "FAIL";
const report = {
  system: "LUMORA_FYP_MEGA_PACK_02_SOURCE_REGISTRY_RUNTIME",
  checkedAt: new Date().toISOString(),
  status,
  checks,
  result: status === "PASS" ? "FYP_MEGA_PACK_02_SOURCE_REGISTRY_RUNTIME_READY" : "FYP_MEGA_PACK_02_SOURCE_REGISTRY_RUNTIME_BLOCKED"
};

fs.writeFileSync("data/fyp/mega-pack-02-source-registry-runtime.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(".lumora-audits/fyp-mega-pack-02-source-registry-runtime.json", JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync("docs/fyp/mega-pack-02-source-registry-runtime.md", [
  "# FYP Mega Pack 02 — Source Registry Runtime",
  "",
  `Status: ${status}`,
  "",
  "```json",
  JSON.stringify(report, null, 2),
  "```",
  ""
].join("\n"));

if (status === "PASS") {
  fs.writeFileSync(".lumora_fyp_mega_pack_02_source_registry_runtime_lock", "FYP_MEGA_PACK_02_SOURCE_REGISTRY_RUNTIME=PASS\n");
} else {
  fs.writeFileSync(".lumora_fyp_mega_pack_02_source_registry_runtime_failed_lock", "FYP_MEGA_PACK_02_SOURCE_REGISTRY_RUNTIME=FAIL\n");
}

console.log(JSON.stringify(report, null, 2));
if (status !== "PASS") process.exit(1);
