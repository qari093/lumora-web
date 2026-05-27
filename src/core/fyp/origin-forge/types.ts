export type OriginForgeWindow = {
  forgeId: string;
  creatorId: string;
  firstContentId: string;
  startedAt: number;
  expiresAt: number;
  seedAudienceSize: number;
  active: boolean;
};

export type OriginForgeResult = {
  forgeId: string;
  creatorId: string;
  impactQuotient: number;
  graduated: boolean;
  discoveryRowUnlocked: boolean;
  newConstellationBadge: boolean;
};
