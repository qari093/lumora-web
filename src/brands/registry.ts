export type BrandAsset = {
  key: string;
  name: string;
  logo: string;
  internalAdsEnabled: boolean;
};

export const BRAND_REGISTRY: Record<string, BrandAsset> = {};

BRAND_REGISTRY["cineverse"] = {
  key: "cineverse",
  name: "CineVerse",
  logo: "/brands/cineverse/logo.png",
  internalAdsEnabled: true,
};
