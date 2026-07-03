export type RelationshipKind =
  | "friend"
  | "family"
  | "creator"
  | "community"
  | "buyer"
  | "seller"
  | "teammate";

export type RelationshipStrength = "weak" | "medium" | "strong" | "inner_circle";

export type RelationshipSignal = {
  id: string;
  fromUserId: string;
  toUserId: string;
  kind: RelationshipKind;
  strength: RelationshipStrength;
  lastInteractionAt: string;
  sharedMoods: string[];
  sharedPortals: string[];
  silentShareAffinity: number;
  echoShareAffinity: number;
  trustScore: number;
};

export type ShareRecipientPrediction = {
  recipientId: string;
  score: number;
  reason: string;
  preferredMode: "instant" | "silent" | "echo" | "gift" | "capsule";
  preferredPortal: string;
};

export type RelationshipMemory = {
  userId: string;
  recipientId: string;
  lastSharedObjectId?: string;
  preferredMoods: string[];
  preferredPortals: string[];
  quietHours: boolean;
  allowSilentShare: boolean;
};
