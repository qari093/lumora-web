import type {
  CanonicalVideoAsset,
  VideoProvider,
} from "./types";

export type ProviderDiscoveryResult = {
  providerId: string;
  cursor?: string;
  assets: CanonicalVideoAsset[];
};

export type ProviderAdapter = {
  provider: VideoProvider;
  discover: () => ProviderDiscoveryResult;
};

export function createProviderAdapter(
  provider: VideoProvider,
  discover: ProviderAdapter["discover"],
): ProviderAdapter {
  return {
    provider,
    discover,
  };
}

export function validateProviderAdapter(
  adapter: ProviderAdapter,
): boolean {
  return (
    !!adapter.provider.id &&
    adapter.provider.enabled &&
    typeof adapter.discover === "function"
  );
}
