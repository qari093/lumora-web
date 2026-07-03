import type {
  RegisteredProvider,
  UniversalProviderAdapter,
} from "./types";

const registry = new Map<string, RegisteredProvider>();

export function registerUniversalProvider(
  adapter: UniversalProviderAdapter,
) {
  registry.set(adapter.provider.id, {
    adapter,
    enabled: true,
    health: "healthy",
  });

  return adapter;
}

export function getUniversalProvider(id: string) {
  return registry.get(id);
}

export function listUniversalProviders() {
  return [...registry.values()]
    .map((p) => p.adapter)
    .sort(
      (a, b) =>
        b.provider.priority -
        a.provider.priority,
    );
}

export function clearUniversalProviders() {
  registry.clear();
}
