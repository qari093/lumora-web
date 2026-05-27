import type { AtmosphereMode } from "../core/types";

export type AtmosphereStackEntry = {
  mode: AtmosphereMode;
  source: "feed" | "row" | "live" | "gmar" | "music" | "relic";
  enteredAt: number;
};

export type AtmosphereStack = {
  userId: string;
  entries: AtmosphereStackEntry[];
};

export function createAtmosphereStack(userId: string): AtmosphereStack {
  if (!userId.trim()) {
    throw new Error("Atmosphere stack requires userId.");
  }

  return {
    userId,
    entries: []
  };
}

export function pushAtmosphereStack(
  stack: AtmosphereStack,
  entry: AtmosphereStackEntry
): AtmosphereStack {
  return {
    ...stack,
    entries: [...stack.entries, entry].slice(-10)
  };
}

export function getCurrentAtmosphere(
  stack: AtmosphereStack
): AtmosphereStackEntry | null {
  return stack.entries.at(-1) ?? null;
}
