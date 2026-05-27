export type DraftTier =
  | "spark"
  | "surge"
  | "nova"
  | "eclipse";

export type CreatorDraftWindow = {
  draftId: string;
  opensAt: number;
  closesAt: number;
  active: boolean;
  maxSelections: number;
};

export type DraftCandidate = {
  creatorId: string;
  auraTier: DraftTier;
  impactQuotient: number;
  eligible: boolean;
};

export type DraftSelection = {
  scoutId: string;
  creatorId: string;
  constellationId: string;
  approved: boolean;
};
