export type SeedPhrase = {
  ownerUserId: string;
  phrase: string;
  active: boolean;
};

export type LineageNode = {
  userId: string;
  invitedBy?: string;
  depth: number;
  impactContribution: number;
};

export type LineageTree = {
  rootUserId: string;
  nodes: LineageNode[];
  totalImpact: number;
  ancestorStatus: boolean;
};
