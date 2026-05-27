export type ZenEconomyAsset =
  | "quiet_coin"
  | "resonance_garden_item"
  | "creator_cosmetic"
  | "constellation_ritual"
  | "storefront_item";

export interface ZenEconomyLedgerEntry {
  id: string;
  creatorId: string;
  viewerId?: string;
  asset: ZenEconomyAsset;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface CreatorEconomyRuntime {
  creatorId: string;
  balance: number;
  payoutEligible: boolean;
  patronageEligible: boolean;
  storefrontEligible: boolean;
}

export interface CreatorStorefrontBridge {
  creatorId: string;
  enabled: boolean;
  zendoroReady: boolean;
  commerceSafetyPassed: boolean;
}

export interface PatronageRuntime {
  constellation: string;
  sponsorName: string;
  copy: string;
  approved: boolean;
}
