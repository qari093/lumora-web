import type {
  ForgeCreator,
  VibeForgeSession
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createVibeForgeSession(input: {
  title: string;
  mode: AtmosphereMode;
  creators: ForgeCreator[];
}): VibeForgeSession {
  if (!input.title.trim()) {
    throw new Error("Vibe Forge requires title.");
  }

  if (input.creators.length < 2) {
    throw new Error("Vibe Forge requires at least 2 creators.");
  }

  return {
    forgeId: `forge_${input.mode}_${Date.now()}`,
    title: input.title,
    mode: input.mode,
    creators: input.creators,
    active: true
  };
}
