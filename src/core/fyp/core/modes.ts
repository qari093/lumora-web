import type { AtmosphereMode } from "./types";

export const FYP_MODES: AtmosphereMode[] = [
  "comfort",
  "drift",
  "chaos",
  "deep",
  "energy",
  "focus",
  "wonder"
];

export function assertValidMode(mode: string): asserts mode is AtmosphereMode {
  if (!FYP_MODES.includes(mode as AtmosphereMode)) {
    throw new Error("Invalid Lumora atmosphere mode.");
  }
}
