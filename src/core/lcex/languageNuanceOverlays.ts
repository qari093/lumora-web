export type LanguageNuanceOverlay = {
  language: string;
  label: string;
  nuanceBoost: number;
  notes: string;
  ironyRisk: "low" | "medium" | "high";
};

export const LANGUAGE_NUANCE_OVERLAYS: LanguageNuanceOverlay[] = [
  {
    language: "en",
    label: "English",
    nuanceBoost: 0,
    notes: "Default nuance baseline.",
    ironyRisk: "medium",
  },
  {
    language: "de",
    label: "German",
    nuanceBoost: 6,
    notes: "Compound phrasing and sarcasm can shift intensity.",
    ironyRisk: "medium",
  },
  {
    language: "ur",
    label: "Urdu",
    nuanceBoost: 12,
    notes: "Honorifics, indirect phrasing, and cultural implication require care.",
    ironyRisk: "high",
  },
  {
    language: "hi",
    label: "Hindi",
    nuanceBoost: 10,
    notes: "Code-mixing and culturally loaded idioms require contextual reading.",
    ironyRisk: "high",
  },
  {
    language: "ar",
    label: "Arabic",
    nuanceBoost: 14,
    notes: "Religious, poetic, and symbolic phrasing may carry elevated sensitivity.",
    ironyRisk: "high",
  },
];

export function getLanguageNuanceOverlay(
  language: string
): LanguageNuanceOverlay {
  return (
    LANGUAGE_NUANCE_OVERLAYS.find(
      (entry) => entry.language === language.trim().toLowerCase()
    ) ?? LANGUAGE_NUANCE_OVERLAYS[0]
  );
}

export function applyLanguageNuanceOverlay(
  baseScore: number,
  language: string
): number {
  const overlay = getLanguageNuanceOverlay(language);
  return Math.max(0, Math.min(100, Math.round(baseScore + overlay.nuanceBoost)));
}
