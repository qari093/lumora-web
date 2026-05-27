export type Constellation = {
  constellationId: string;
  title: string;
  scoutId: string;
  creatorIds: string[];
  active: boolean;
};

export type ConstellationRole =
  | "architect"
  | "signal-runner"
  | "pulse-artist"
  | "myth-builder";

export type ConstellationMember = {
  creatorId: string;
  role: ConstellationRole;
  joinedAt: number;
};
