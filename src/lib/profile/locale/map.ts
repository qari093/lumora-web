export type LocaleProfile = {
  language: string;
  region: string;
};

export function resolveLocale(): LocaleProfile {
  return {
    language: "en",
    region: "EU",
  };
}
