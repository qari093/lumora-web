export type CreatorCommerceItemType =
  | "merchandise"
  | "digital_collectible"
  | "premium_ritual"
  | "membership"
  | "creator_vault"
  | "collaboration_slot";

export interface CreatorCommerceItem {
  id: string;
  creatorId: string;
  type: CreatorCommerceItemType;
  title: string;
  price: number;
  zencoinEligible: boolean;
  safetyApproved: boolean;
}

export interface CreatorCommerceStorefront {
  creatorId: string;
  zendoroReady: boolean;
  enabled: boolean;
  items: CreatorCommerceItem[];
}

export interface SilentSupporterTier {
  id: string;
  creatorId: string;
  name: string;
  monthlyPrice: number;
  publicRankHidden: true;
}

export interface CreatorCommerceTrust {
  creatorId: string;
  verified: boolean;
  refundSafe: boolean;
  moderationSafe: boolean;
  score: number;
}
