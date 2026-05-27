import type { AtmosphereMode } from "../core/types";

export type AtmosphereConquest = {
  conquestId: string;
  mode: AtmosphereMode;
  startsAt: number;
  endsAt: number;
  active: boolean;
  creatorIds: string[];
};

export type ConquestStanding = {
  creatorId: string;
  impactQuotient: number;
  resonance: number;
  voltage: number;
  rank: number;
};

export type ConquestWinner = {
  creatorId: string;
  conquestId: string;
  crowned: boolean;
  rewardTitle: string;
};
