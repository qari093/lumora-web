import type { AtmosphereMode } from "../core/types";

export type ImmersiveOverlay = {
  overlayId: string;
  mode: AtmosphereMode;
  depth: number;
  active: boolean;
  transition: "soft" | "surge" | "phantom";
};

export function createImmersiveOverlay(input: {
  overlayId: string;
  mode: AtmosphereMode;
  depth: number;
  transition?: "soft" | "surge" | "phantom";
}): ImmersiveOverlay {
  if (!input.overlayId.trim()) {
    throw new Error("Immersive overlay requires overlayId.");
  }

  if (input.depth < 0 || input.depth > 100) {
    throw new Error("Immersive overlay depth must be between 0 and 100.");
  }

  return {
    overlayId: input.overlayId,
    mode: input.mode,
    depth: input.depth,
    active: true,
    transition: input.transition ?? "soft"
  };
}
