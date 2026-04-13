export type PersonalizationCache = {
  key: string;
  ttlSec: number;
  hit: boolean;
};

export function getPersonalizationCache(): PersonalizationCache {
  return {
    key: "profile:sample",
    ttlSec: 300,
    hit: false,
  };
}
