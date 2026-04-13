import type { TrustState } from "./trustState";

export type OfficialPromoSourceCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type OfficialPromoSource = {
  id: string;
  name: string;
  domain: string;
  category: OfficialPromoSourceCategory;
  trustState: Extract<TrustState, "official" | "verified" | "partner-approved">;
  active: boolean;
  region: string;
};

export const OFFICIAL_PROMO_SOURCE_REGISTRY: OfficialPromoSource[] = [
  {
    id: "lumora-editorial",
    name: "Lumora Editorial",
    domain: "lumora.app",
    category: "cross-media",
    trustState: "official",
    active: true,
    region: "global",
  },
  {
    id: "studio-official-placeholder",
    name: "Official Studio Source",
    domain: "official.example",
    category: "movie",
    trustState: "official",
    active: true,
    region: "global",
  },
  {
    id: "label-official-placeholder",
    name: "Official Label Source",
    domain: "label.example",
    category: "music",
    trustState: "official",
    active: true,
    region: "global",
  },
  {
    id: "publisher-official-placeholder",
    name: "Official Publisher Source",
    domain: "publisher.example",
    category: "gaming",
    trustState: "official",
    active: true,
    region: "global",
  },
];

export function getActiveOfficialPromoSources(): OfficialPromoSource[] {
  return OFFICIAL_PROMO_SOURCE_REGISTRY.filter((source) => source.active);
}

export function findOfficialPromoSourceByDomain(
  domain: string
): OfficialPromoSource | undefined {
  return OFFICIAL_PROMO_SOURCE_REGISTRY.find(
    (source) => source.domain.toLowerCase() === domain.toLowerCase()
  );
}
