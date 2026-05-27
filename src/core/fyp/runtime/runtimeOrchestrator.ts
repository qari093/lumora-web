import {
  calculateEmotionalLoad
} from "./loadBalancer";

import {
  evaluateModeTransition
} from "./engines/modeTransition";

import type {
  RuntimeFeedItem,
  RuntimeMode
} from "./types";

export function orchestrateRuntime(input: {
  mode: RuntimeMode;
  items: RuntimeFeedItem[];
  chaosBudget: number;
}) {
  const emotionalLoad =
    calculateEmotionalLoad(input.items);

  const transition =
    evaluateModeTransition({
      currentMode: input.mode,
      emotionalLoad,
      chaosBudget: input.chaosBudget
    });

  return {
    emotionalLoad,
    transition
  };
}
