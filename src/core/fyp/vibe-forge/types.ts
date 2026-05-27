import type { AtmosphereMode } from "../core/types";

export type ForgeRole =
  | "visual-architect"
  | "pulse-designer"
  | "sound-weaver"
  | "myth-narrator"
  | "signal-runner";

export type ForgeCreator = {
  creatorId: string;
  role: ForgeRole;
  auraTier: string;
};

export type VibeForgeSession = {
  forgeId: string;
  title: string;
  mode: AtmosphereMode;
  creators: ForgeCreator[];
  active: boolean;
};

export type CollectiveAura = {
  auraId: string;
  forgeId: string;
  intensity: number;
  synchronized: boolean;
};

export type RevenueSplit = {
  creatorId: string;
  percentage: number;
};
