import type { CreateShareInput, SharePortal } from "../foundation/types";
import type { UniversalShareDestination } from "./destinations";
import type { UniversalShareMode } from "./modes";

export type UniversalSharePreview = {
  title: string;
  subtitle: string;
  transformationLabel: string;
  destinationPortal: SharePortal;
  mode: UniversalShareMode;
};

export function createUniversalSharePreview(
  input: CreateShareInput,
  destination: UniversalShareDestination,
  mode: UniversalShareMode,
): UniversalSharePreview {
  const transformationLabel =
    destination.portal === "lumaspace"
      ? "Memory Star"
      : destination.portal === "lumalink"
        ? "Conversation Card"
        : destination.portal === "live"
          ? "Watch Moment"
          : destination.portal === "zendoro"
            ? "Giftable Recommendation"
            : destination.portal === "memory_vault"
              ? "Archived Memory"
              : "Universal Link";

  return {
    title: input.title,
    subtitle: `${input.sourcePortal} → ${destination.label}`,
    transformationLabel,
    destinationPortal: destination.portal,
    mode,
  };
}
