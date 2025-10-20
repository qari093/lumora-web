import { cookies, headers } from "next/headers";

export const SUPPORTED = ["en","ur"] as const;
export type Lang = typeof SUPPORTED[number];
export const DEFAULT_LANG: Lang = "en";
const COOKIE_NAME = "lang";

export function normalizeLang(raw?: string|null): Lang {
  const v = (raw||"").toLowerCase();
  for (const l of SUPPORTED) if (v===l || v.startsWith(l+"-")) return l;
  return DEFAULT_LANG;
}

export async function getLangFromRequest(): Promise<Lang> {
  try {
    const c = await cookies();
    const fromCookie = c.get(COOKIE_NAME)?.value;
    if (fromCookie) return normalizeLang(fromCookie);
  } catch {}
  try {
    const h = await headers();
    const al = h.get("accept-language");
    if (al) return normalizeLang(al.split(",")[0]||"");
  } catch {}
  return DEFAULT_LANG;
}

export function setLangCookieHeader(lang: Lang): [string, string] {
  // returns [headerName, headerValue] pair
  return ["set-cookie", `${COOKIE_NAME}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`];
}

export function n(cents: number, lang: Lang = DEFAULT_LANG): string {
  try { return new Intl.NumberFormat(lang).format(cents); } catch { return String(cents); }
}
export function money(cents: number, lang: Lang = DEFAULT_LANG, currency: string = "EUR"): string {
  try { return new Intl.NumberFormat(lang, { style:"currency", currency }).format((cents||0)/100); }
  catch { return "€"+((cents||0)/100).toFixed(2); }
}
export function dateIso(d: Date|string|number, lang: Lang = DEFAULT_LANG): string {
  try { return new Intl.DateTimeFormat(lang, { dateStyle:"medium", timeStyle:"short" }).format(new Date(d)); }
  catch { return new Date(d).toISOString(); }
}

// Tiny in-memory cache for server load of JSON
const cache: Record<string, any> = {};
async function loadNs(lang: Lang, ns: string): Promise<any> {
  const key = `${lang}:${ns}`;
  if (cache[key]) return cache[key];
  // Keep it simple: import JSON with dynamic path
  const mod = await import(`../../locales/${lang}/${ns}.json`).catch(async () => {
    // Fallback to default lang
    return import(`../../locales/${DEFAULT_LANG}/${ns}.json`);
  });
  cache[key] = mod.default || mod;
  return cache[key];
}
export async function t(lang: Lang, ns: string, k: string, vars?: Record<string, any>): Promise<string> {
  const obj = await loadNs(lang, ns);
  let s = (obj && obj[k]) || k;
  if (vars) for (const [vk, vv] of Object.entries(vars)) s = s.replace(new RegExp(`\\{${vk}\\}`,"g"), String(vv));
  return s;
}
