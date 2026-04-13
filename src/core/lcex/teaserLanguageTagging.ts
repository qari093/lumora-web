export type TeaserLanguageTag =
  | "en"
  | "de"
  | "ur"
  | "hi"
  | "ar"
  | "fr"
  | "es"
  | "multi"
  | "unknown";

export type LanguageTaggedTeaser = {
  id: string;
  language?: string;
  subtitleLanguages?: string[];
};

function normalizeLanguage(value?: string): string {
  return (value || "").trim().toLowerCase();
}

export function inferTeaserLanguageTag(
  input: LanguageTaggedTeaser
): TeaserLanguageTag {
  const primary = normalizeLanguage(input.language);
  const subtitles = (input.subtitleLanguages || []).map(normalizeLanguage).filter(Boolean);
  const all = [...new Set([primary, ...subtitles].filter(Boolean))];

  if (all.length === 0) return "unknown";
  if (all.length > 1) return "multi";
  if (all[0] === "en") return "en";
  if (all[0] === "de") return "de";
  if (all[0] === "ur") return "ur";
  if (all[0] === "hi") return "hi";
  if (all[0] === "ar") return "ar";
  if (all[0] === "fr") return "fr";
  if (all[0] === "es") return "es";
  return "unknown";
}

export function attachTeaserLanguageTag<T extends LanguageTaggedTeaser>(
  input: T
): T & { languageTag: TeaserLanguageTag } {
  return {
    ...input,
    languageTag: inferTeaserLanguageTag(input),
  };
}
