export type LanguageTier = "tier1" | "tier2";

export type Lang = {
  code: string; // BCP-47 / ISO-ish (app-level)
  label: string;
  tier: LanguageTier;
};

export const TIER1_LANGUAGES: ReadonlyArray<Lang> = Object.freeze([
  { code: "en", label: "English", tier: "tier1" },
  { code: "de", label: "Deutsch", tier: "tier1" },
  { code: "es", label: "Español", tier: "tier1" },
  { code: "fr", label: "Français", tier: "tier1" },
  { code: "it", label: "Italiano", tier: "tier1" },
  { code: "pt", label: "Português", tier: "tier1" },
  { code: "nl", label: "Nederlands", tier: "tier1" },
  { code: "sv", label: "Svenska", tier: "tier1" },
  { code: "pl", label: "Polski", tier: "tier1" },
  { code: "tr", label: "Türkçe", tier: "tier1" },
  { code: "ar", label: "العربية", tier: "tier1" },
  { code: "ur", label: "اردو", tier: "tier1" }, // Urdu in Tier-1
]);

export function isTier1(code: string): boolean {
  const c = (code || "").toLowerCase();
  return TIER1_LANGUAGES.some((x) => x.code === c);
}
