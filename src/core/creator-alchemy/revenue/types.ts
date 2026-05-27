export type PatronageStatus = "draft" | "approved" | "rejected" | "active";
export type SponsorTone = "calm" | "reflective" | "creative" | "restorative";
export type RevenueRisk = "loud_ad" | "poor_fit" | "casino_language" | "pay_to_win" | "creator_extraction";

export interface ConstellationPatronage {
  id: string;
  brandName: string;
  constellationId: string;
  tone: SponsorTone;
  line: string;
  status: PatronageStatus;
  logoScale: "tiny";
  interruptive: false;
}

export interface BrandCompatibilityInput {
  brandName: string;
  sponsorTone: SponsorTone;
  constellationAtmosphere: string;
  copy: string;
}

export interface BrandCompatibilityResult {
  ok: boolean;
  score: number;
  risks: RevenueRisk[];
}

export interface CreatorPayoutInput {
  grossAmount: number;
  creatorShare: number;
  platformShare: number;
  fraudCleared: boolean;
  fiatBridgeAllowed: boolean;
}

export interface CreatorPayoutDecision {
  payable: boolean;
  creatorAmount: number;
  platformAmount: number;
  reason: string;
}

export interface RevenueTransparencySnapshot {
  patronageActive: boolean;
  fiatBridgeAllowed: boolean;
  antiCasinoPassed: boolean;
  creatorMajorityShare: boolean;
}
