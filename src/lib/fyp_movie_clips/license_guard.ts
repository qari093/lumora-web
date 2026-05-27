import { getSafeMovieSource } from "./legal_sources";

export type MovieClipLicenseInput = {
  sourceId: string;
  license?: string;
  sourceUrl?: string;
};

const SAFE_LICENSE_TERMS = [
  "public domain",
  "pd",
  "cc0",
  "cc-by",
  "creative commons attribution",
  "owned",
  "licensed",
  "allowed embed",
];

const UNSAFE_LICENSE_TERMS = [
  "all rights reserved",
  "unknown",
  "editorial only",
  "non-commercial",
  "cc-by-nc",
  "copyrighted",
];

export function normalizeLicense(value?: string): string {
  return String(value || "").trim().toLowerCase();
}

export function isSafeMovieClipLicense(input: MovieClipLicenseInput): boolean {
  const source = getSafeMovieSource(input.sourceId);
  if (!source) return false;

  const license = normalizeLicense(input.license || source.type);

  if (UNSAFE_LICENSE_TERMS.some((term) => license.includes(term))) return false;
  if (SAFE_LICENSE_TERMS.some((term) => license.includes(term))) return true;

  return source.commercialAllowed === true;
}

export function buildLicenseProof(input: MovieClipLicenseInput) {
  return {
    sourceId: input.sourceId,
    sourceUrl: input.sourceUrl || "",
    license: normalizeLicense(input.license),
    checkedAt: new Date().toISOString(),
    safe: isSafeMovieClipLicense(input),
  };
}
