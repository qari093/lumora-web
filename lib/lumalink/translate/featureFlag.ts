export type TranslationMode = "off" | "captions" | "dual-audio" | "replace-audio";

export type TranslationFlags = {
  enabled: boolean;
  mode: TranslationMode;
  // strict privacy: no storage by default
  noStorage: boolean;
};

export function getTranslationFlags(env: NodeJS.ProcessEnv = process.env): TranslationFlags {
  const enabled = env.LUMALINK_TRANSLATE_V1 === "1";
  const mode = (env.LUMALINK_TRANSLATE_MODE || "off") as TranslationMode;
  const noStorage = env.LUMALINK_TRANSLATE_NOSTORE !== "0";
  const safeMode: TranslationMode =
    mode === "captions" || mode === "dual-audio" || mode === "replace-audio" ? mode : "off";
  return { enabled, mode: enabled ? safeMode : "off", noStorage };
}
