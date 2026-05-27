import type { CreatorStorefrontBridge } from "./types";

export function buildCreatorStorefrontBridge(input: CreatorStorefrontBridge): CreatorStorefrontBridge {
  return {
    ...input,
    enabled: input.enabled && input.zendoroReady && input.commerceSafetyPassed
  };
}
