import type {
  CallTranslationConfig,
  TranslationSessionParams,
  TranslationTone,
} from "@/lib/lumalink/translate/core/types";

/**
 * Runtime adapter: converts session-level UI controls into CallTranslationConfig fields.
 * - No UI, no persistence, no network.
 * - Explicit defaults: tone defaults to "neutral" when params.ui.tone missing.
 */
export function applySessionParamsToCallConfig(
  base: CallTranslationConfig,
  params: TranslationSessionParams
): CallTranslationConfig {
  const tone: TranslationTone = (params?.ui?.tone ?? "neutral") as TranslationTone;

  // Language rules:
  // - If autoDetect=true => keep base.from unless caller omitted it.
  // - If autoDetect=false and params.ui.language.from is provided => override base.from.
  // - Always set "to" from UI (required by type).
  const lang = params.ui.language;
  const from =
    lang.autoDetect === false && typeof lang.from === "string" && lang.from.length > 0
      ? lang.from
      : (base.from ?? "auto");

  const to = lang.to;

  return {
    ...base,
    from,
    to,
    tone,
    sessionParams: params,
  };
}


/**
 * Stable public adapter — converts TranslationSessionParams into CallTranslationConfig overrides.
 * Conservative behavior:
 * - If ui.language.autoDetect=true => leave 'from' undefined (auto)
 * - If autoDetect=false and ui.language.from set => set 'from'
 * - Always sets 'to'
 * - Sets 'tone' if present on config types (non-breaking)
 */
export function uiControlsAdapter(params: any) {
  const ui = params?.ui || {};
  const lang = ui?.language || {};
  const tone = ui?.tone;

  const out: any = {};
  if (lang && typeof lang === "object") {
    if (lang.autoDetect === false && typeof lang.from === "string" && lang.from.length) out.from = lang.from;
    if (typeof lang.to === "string" && lang.to.length) out.to = lang.to;
  }
  if (typeof tone === "string" && tone.length) out.tone = tone;
  return out;
}
