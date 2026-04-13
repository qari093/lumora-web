export type LumoraMode = "chill" | "focus" | "surge";

export function resolveMode(input?: string): LumoraMode {
  if (input === "focus") return "focus";
  if (input === "surge") return "surge";
  return "chill";
}
