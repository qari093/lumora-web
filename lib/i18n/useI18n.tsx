'use client';

import * as React from 'react';

export type I18nParams = Record<string, string | number | boolean | null | undefined>;

export type I18nResult = {
  lang: string;
  t: (key: string, params?: I18nParams) => string;
};

/**
 * Build-safe i18n hook.
 * Goals:
 * - Avoid parse errors from previous automated patches.
 * - Be compatible with both default and named imports.
 * - Provide a stable `t()` and `lang` for callers.
 *
 * This is intentionally minimal: it returns the key as fallback if no translation map is present.
 * If a global dictionary is later introduced, it can be wired without changing call sites.
 */
export function useI18n(): I18nResult {
  const lang = React.useMemo(() => {
    if (typeof document === 'undefined') return 'en';
    const docLang = (document.documentElement && document.documentElement.lang) || '';
    return (docLang || 'en').toLowerCase();
  }, []);

  const t = React.useCallback((key: string, params?: I18nParams) => {
    let out = String(key);

    // Optional global dictionary support (non-breaking):
    // window.__LUMORA_I18N__ = { en: { "hello": "Hello" }, de: { ... } }
    try {
      const g: any = typeof window !== 'undefined' ? (window as any) : undefined;
      const dict = g && g.__LUMORA_I18N__ && g.__LUMORA_I18N__[lang];
      const hit = dict && typeof dict[key] === 'string' ? dict[key] : null;
      if (hit) out = hit;
    } catch {
      // ignore
    }

    if (params && typeof params === 'object') {
      for (const [k, v] of Object.entries(params)) {
        const val = v === null || v === undefined ? '' : String(v);
        // Replace both {key} and {{key}} styles.
        out = out.split(`{${k}}`).join(val);
        out = out.split(`{{${k}}}`).join(val);
      }
    }
    return out;
  }, [lang]);

  return { lang, t };
}

export default useI18n;
