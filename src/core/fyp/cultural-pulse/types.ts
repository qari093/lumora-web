import type { AtmosphereMode } from "../core/types";

export type CityPulse = {
  cityId: string;
  cityName: string;
  country: string;
  dominantMode: AtmosphereMode;
  activeUsers: number;
  pulseStrength: number;
  updatedAt: number;
};

export type GlobalPulseWave = {
  waveId: string;
  mode: AtmosphereMode;
  cities: string[];
  totalEnergy: number;
  trend: "rising" | "stable" | "falling";
};

export type LocalCulturalSignal = {
  signalId: string;
  cityId: string;
  category: "music" | "sports" | "weather" | "nightlife" | "festival";
  energyBoost: number;
  expiresAt: number;
};
