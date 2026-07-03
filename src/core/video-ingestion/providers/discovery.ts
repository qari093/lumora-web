import { runValidationPipeline } from "../runtime";
import { getUniversalProvider, listUniversalProviders } from "./registry";

export async function discoverProviderAssets(providerId: string, cursor?: string) {
  const registered = getUniversalProvider(providerId);

  if (!registered) {
    throw new Error(`provider_not_registered:${providerId}`);
  }

  if (!registered.enabled) {
    throw new Error(`provider_disabled:${providerId}`);
  }

  if (registered.health === "offline") {
    throw new Error(`provider_offline:${providerId}`);
  }

  const result = registered.adapter.discover(cursor);
  const discovery = result instanceof Promise ? await result : result;

    const runtime = runValidationPipeline(
      registered.adapter.provider.id,
      discovery.assets,
    );

    return {
      providerId,
      cursor: discovery.cursor,
      runtime,
      assets: runtime.assets,
    };
}

export async function discoverAllEnabledProviders() {
  const providers = listUniversalProviders();
  const results = [];

  for (const provider of providers) {
    const result = await discoverProviderAssets(provider.provider.id);
    results.push(result);
  }

  return results;
}
