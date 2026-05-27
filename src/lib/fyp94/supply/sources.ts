import type { Fyp94ContentSource } from "../core/policy";

export type Fyp94SupplySourceConfig = {
  id: Fyp94ContentSource;
  displayName: string;
  commercialUseAllowed: boolean;
  modificationAllowed: boolean;
  attributionRequired: boolean;
  enabled: boolean;
};

export const FYP94_SUPPLY_SOURCES: Record<Fyp94ContentSource, Fyp94SupplySourceConfig> = {
  pexels: {
    id: "pexels",
    displayName: "Pexels",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    enabled: true,
  },
  pixabay: {
    id: "pixabay",
    displayName: "Pixabay",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    enabled: true,
  },
  mixkit: {
    id: "mixkit",
    displayName: "Mixkit",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    enabled: true,
  },
  coverr: {
    id: "coverr",
    displayName: "Coverr",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    enabled: true,
  },
  creator_authorized: {
    id: "creator_authorized",
    displayName: "Creator Authorized",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    enabled: true,
  },
  partner_authorized: {
    id: "partner_authorized",
    displayName: "Partner Authorized",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    enabled: true,
  },
  lumora_owned: {
    id: "lumora_owned",
    displayName: "Lumora Owned",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
    enabled: true,
  },
};

export function getEnabledFyp94SupplySources(): Fyp94SupplySourceConfig[] {
  return Object.values(FYP94_SUPPLY_SOURCES).filter((source) => source.enabled);
}
