import type { CanonicalVideoAsset, VideoProvider } from "../runtime";

export type ProviderHealth =
  | "healthy"
  | "degraded"
  | "offline";

export type ProviderCapabilities = {
  api: boolean;
  directDownload: boolean;
  pagination: boolean;
  webhooks: boolean;
  incrementalSync: boolean;
};

export type ProviderDiscoveryResult = {
  assets: CanonicalVideoAsset[];
  cursor?: string;
};

export interface UniversalProviderAdapter {
  provider: VideoProvider;
  capabilities: ProviderCapabilities;
  discover(cursor?: string): Promise<ProviderDiscoveryResult> | ProviderDiscoveryResult;
}

export type RegisteredProvider = {
  adapter: UniversalProviderAdapter;
  health: ProviderHealth;
  enabled: boolean;
};
