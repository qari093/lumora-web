import {
  LUMORA_LICENSE_BLOCKLIST,
  LUMORA_LICENSE_WHITELIST,
  type LicenseDecision,
  type LumoraLicenseKind,
} from "./licenseTypes";

export function normalizeLicenseText(input: string | undefined | null): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function detectLicenseKind(input: string | undefined | null): LumoraLicenseKind | null {
  const value = normalizeLicenseText(input);

  if (!value) return null;
  if (value.includes("public domain") || value === "pd" || value.includes("u.s. government work")) return "public-domain";
  if (value.includes("cc0") || value.includes("creative commons zero")) return "cc0";
  if (value.includes("cc by 4") || value.includes("cc-by-4") || value.includes("attribution 4.0")) return "cc-by-4.0";
  if (value.includes("cc by 3") || value.includes("cc-by-3") || value.includes("attribution 3.0")) return "cc-by-3.0";
  if (value.includes("owned") || value.includes("licensed by lumora") || value.includes("owned-license")) return "owned-license";
  if (value.includes("pexels") || value.includes("pixabay") || value.includes("mixkit") || value.includes("coverr") || value.includes("royalty-free")) return "platform-safe";

  return null;
}

export function validateLicense(input: string | undefined | null): LicenseDecision {
  const raw = normalizeLicenseText(input);

  if (!raw) {
    return {
      ok: false,
      normalized: null,
      attributionRequired: false,
      commercialUseAllowed: false,
      reason: "missing_license",
    };
  }

  if (LUMORA_LICENSE_BLOCKLIST.some((term) => raw.includes(term))) {
    return {
      ok: false,
      normalized: null,
      attributionRequired: false,
      commercialUseAllowed: false,
      reason: "blocked_license_term",
    };
  }

  const kind = detectLicenseKind(raw);

  if (!kind || !LUMORA_LICENSE_WHITELIST.includes(kind)) {
    return {
      ok: false,
      normalized: null,
      attributionRequired: false,
      commercialUseAllowed: false,
      reason: "not_whitelisted",
    };
  }

  return {
    ok: true,
    normalized: kind,
    attributionRequired: kind === "cc-by-3.0" || kind === "cc-by-4.0",
    commercialUseAllowed: true,
    reason: "accepted",
  };
}
