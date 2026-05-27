import type { AtmosphereMode } from "../core/types";

export type SynchronicityFlare = {
  flareId: string;
  mode: AtmosphereMode;
  participants: string[];
  triggeredAt: number;
  expiresAt: number;
  collectiveEnergy: number;
  active: boolean;
};

export type FlareMemory = {
  memoryId: string;
  flareId: string;
  preservedParticipants: number;
  emotionalIntensity: number;
  createdAt: number;
};

export type FlareWindow = {
  windowId: string;
  mode: AtmosphereMode;
  opensAt: number;
  closesAt: number;
  urgencyLevel: "low" | "elevated" | "critical";
};
