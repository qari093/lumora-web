export const LEGAL_SEED_SOURCES = [
  "NASA",
  "ESA",
  "ESA_HUBBLE",
  "NHK_CREATIVE",
  "INTERNET_ARCHIVE",
  "PRELINGER",
  "WIKIMEDIA_COMMONS",
  "OFFICIAL_TRAILERS",
  "LICENSED_INDIE",
  "LUMORA_OWNED"
] as const;

export function getLegalSeedSources() {
  return LEGAL_SEED_SOURCES;
}
