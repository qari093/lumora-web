export type LegalSeedSource = {
  id: string;
  name: string;
  category: "space" | "archive" | "culture" | "stock" | "official" | "owned";
  rights: "public-domain" | "open-access" | "cc-filtered" | "embed-only" | "owned-licensed";
  active: boolean;
};

export const legalSeedSources: LegalSeedSource[] = [
  { id: "nasa", name: "NASA", category: "space", rights: "public-domain", active: true },
  { id: "esa", name: "ESA", category: "space", rights: "open-access", active: true },
  { id: "hubble", name: "ESA/Hubble", category: "space", rights: "open-access", active: true },
  { id: "internet-archive", name: "Internet Archive", category: "archive", rights: "public-domain", active: true },
  { id: "loc", name: "Library of Congress", category: "archive", rights: "public-domain", active: true },
  { id: "smithsonian", name: "Smithsonian Open Access", category: "culture", rights: "open-access", active: true },
  { id: "wikimedia", name: "Wikimedia Commons", category: "culture", rights: "cc-filtered", active: true },
  { id: "pexels", name: "Pexels Videos", category: "stock", rights: "open-access", active: true },
  { id: "pixabay", name: "Pixabay Videos", category: "stock", rights: "open-access", active: true },
  { id: "coverr", name: "Coverr", category: "stock", rights: "open-access", active: true },
  { id: "mixkit", name: "Mixkit", category: "stock", rights: "open-access", active: true },
  { id: "official-trailers", name: "Official Movie Trailers", category: "official", rights: "embed-only", active: true },
  { id: "lumora-owned", name: "Lumora Owned & Licensed Content", category: "owned", rights: "owned-licensed", active: true }
];

export function getActiveLegalSeedSources(): LegalSeedSource[] {
  return legalSeedSources.filter((source) => source.active);
}

export function validateLegalSeedSources(): boolean {
  return getActiveLegalSeedSources().length >= 10;
}

export function getLegalSeedSources(): LegalSeedSource[] {
  return getActiveLegalSeedSources();
}
