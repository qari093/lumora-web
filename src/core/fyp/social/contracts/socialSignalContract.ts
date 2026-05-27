import type { SocialSignal } from "../types";

export function validateSocialSignal(
  signal: SocialSignal
): boolean {
  return (
    typeof signal.id === "string" &&
    typeof signal.type === "string" &&
    typeof signal.strength === "number"
  );
}
