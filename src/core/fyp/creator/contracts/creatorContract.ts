import type { CreatorProfile } from "../types";

export function validateCreatorProfile(
  input: CreatorProfile
): boolean {
  return Boolean(
    input.id &&
    input.handle &&
    typeof input.reputation === "number"
  );
}
