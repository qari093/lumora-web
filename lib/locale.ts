export type LocaleInfo = {
  lang: string;        // e.g. "ur-PK"
  language: string;    // "ur"
  region?: string;     // "PK"
};

export function pickLocale(req: Request): LocaleInfo {
  const header = req.headers.get("accept-language")?.trim() || "";
  const parts = header.split(",").map(p => p.split(";")[0].trim()).filter(Boolean);
  const first = parts[0] || "en-US";
  const [languageRaw, regionRaw] = first.replace("_","-").split("-");
  const language = (languageRaw || "en").toLowerCase();
  const region = regionRaw ? regionRaw.toUpperCase() : undefined;
  const lang = region ? `${language}-${region}` : language;
  return { lang, language, region };
}

export function fmtNumber(n: number, lang: string, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(lang, opts).format(n);
}

export function fmtDateISO(iso: string, lang: string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short", ...opts }).format(new Date(iso));
}
