import { resolveAdsActivation, type AdsActivationInput } from "@/lib/ads/activation";

export type OrganicFeedItem = {
  id: string;
  title: string;
  category: string;
  kind?: "organic";
};

export type InternalAdItem = {
  id: string;
  title: string;
  category: string;
  kind: "sponsored";
  source: "internal_portal";
  portal: "GMAR" | "NEXA" | "MOVIES" | "LIVE" | "MUSIC";
};

export type AdServingInput = {
  organicFeed: OrganicFeedItem[];
  internalAds: InternalAdItem[];
  activation: AdsActivationInput;
};

export type AdServingResult =
  | { ok: true; feed: Array<OrganicFeedItem | InternalAdItem>; inserted: number }
  | { ok: false; reason: string };

export function integrateAdServing(input: AdServingInput): AdServingResult {
  const activation = resolveAdsActivation(input.activation);
  if (!activation.ok) return { ok: false, reason: activation.reason };

  const { config } = activation;

  const organicFeed = Array.isArray(input.organicFeed) ? input.organicFeed : [];
  const internalAds = Array.isArray(input.internalAds) ? input.internalAds : [];

  if (config.mode === "disabled" || !config.enabled) {
    return { ok: true, feed: organicFeed, inserted: 0 };
  }

  const maxAds = Math.min(config.maxSponsoredPerFeed, internalAds.length);
  if (maxAds <= 0) {
    return { ok: true, feed: organicFeed, inserted: 0 };
  }

  const out: Array<OrganicFeedItem | InternalAdItem> = [];
  let adIndex = 0;

  for (let i = 0; i < organicFeed.length; i++) {
    out.push(organicFeed[i]);

    const slotIndex = i + 1;

    if (
      adIndex < maxAds &&
      slotIndex >= 2 &&
      slotIndex % 4 === 0
    ) {
      out.push(internalAds[adIndex]);
      adIndex += 1;
    }
  }

  return { ok: true, feed: out, inserted: adIndex };
}
