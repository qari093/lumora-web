/* LUMORA_VIBE_TAGS_LITE_ENV_HELPER_V2
   ENV override (server + tests):
     LUMORA_VIBE_TAGS_LITE=1|0|true|false|yes|no
     NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE=... (fallback)
   Default behavior remains unchanged if env is not set.
*/
function __parseBoolEnv(v: unknown): boolean | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim().toLowerCase();
  if (["1","true","yes","y","on","enable","enabled"].includes(s)) return true;
  if (["0","false","no","n","off","disable","disabled"].includes(s)) return false;
  return undefined;
}
function __vibeLiteEnvOverride(): boolean | undefined {
  const a = __parseBoolEnv(process.env.LUMORA_VIBE_TAGS_LITE);
  if (typeof a === "boolean") return a;
  const b = __parseBoolEnv(process.env.NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE);
  if (typeof b === "boolean") return b;
  return undefined;
}
/* LUMORA_VIBE_TAGS_LITE_ENV_HELPER_V1
   ENV override:
     LUMORA_VIBE_TAGS_LITE=1|0|true|false|yes|no
   Default behavior remains unchanged if env is not set.
*/

export function vibeTagsLiteEnabled(): boolean {
  
  // __vibeTagsLiteEnabled__ov_guard_v3
  const __ov = __vibeLiteEnvOverride();
  if (typeof __ov === "boolean") return __ov;
try {
    const v = process.env.VIBE_TAGS_LITE;
    return v === "1" || v === "true";
  } catch {
    return false;
  }
}
