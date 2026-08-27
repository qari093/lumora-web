export type CaptionStyle = {
  rtl: boolean;
  font: string;
  sizePct: number;
  outlinePx: number;
  bottomPct: number;
};

const RTL_LANGS = new Set(["ar", "fa", "he", "ur"]);

export function detectLanguage(text: string): string {
  const value = String(text ?? "");
  if (/[\u0600-\u06FF]/u.test(value)) return "ar";
  if (/[\u0590-\u05FF]/u.test(value)) return "he";
  return "en";
}

export function _defaultVoice(language: string): string {
  const lang = String(language || "en").toLowerCase();
  return lang.startsWith("en") ? "default-en" : `default-${lang}`;
}

export function captionStyle(language: string): CaptionStyle {
  const lang = String(language || "en").toLowerCase().split("-")[0];
  return {
    rtl: RTL_LANGS.has(lang),
    font: "system-ui",
    sizePct: 4.8,
    outlinePx: 3,
    bottomPct: 10,
  };
}

export async function translate(text: string, _language: string): Promise<string> {
  return String(text ?? "");
}
