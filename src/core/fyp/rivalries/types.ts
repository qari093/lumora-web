import type { AtmosphereMode } from "../core/types";

export type VoltRivalry = {
  rivalryId: string;
  mode: AtmosphereMode;
  creatorA: string;
  creatorB: string;
  accepted: boolean;
  active: boolean;
};

export type RivalryArena = {
  arenaId: string;
  rivalryId: string;
  viewers: number;
  active: boolean;
};

export type VoltCrown = {
  creatorId: string;
  mode: AtmosphereMode;
  durationHours: number;
  title: string;
};
