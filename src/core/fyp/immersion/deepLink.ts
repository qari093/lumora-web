import type { ResonanceRowItem } from "../resonance-row/types";

export function createAtmosphereDeepLink(
  item: ResonanceRowItem
): string {
  if (!item.deepLink.startsWith("/")) {
    throw new Error("Atmosphere deep link must be app-relative.");
  }

  return `/fyp/atmosphere?surface=${encodeURIComponent(item.surface)}&target=${encodeURIComponent(item.deepLink)}`;
}
