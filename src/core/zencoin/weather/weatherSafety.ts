export const forbiddenClinicalTerms = [
  "anxiety",
  "depression",
  "healing",
  "trauma",
  "therapy",
  "diagnosis"
] as const;

export const allowedWeatherTerms = [
  "calm",
  "reflective",
  "gentle",
  "bright",
  "focused",
  "quiet"
] as const;

export function phraseIsLegalSafe(phrase: string): boolean {
  const lower = phrase.toLowerCase();
  return !forbiddenClinicalTerms.some((term) => lower.includes(term));
}

export function createWeatherPhrase(): string {
  return "The world outside feels calm today.";
}

export function financialWeatherSafetyHealthy(): boolean {
  return (
    phraseIsLegalSafe(createWeatherPhrase()) &&
    allowedWeatherTerms.includes("calm") &&
    forbiddenClinicalTerms.includes("therapy")
  );
}
