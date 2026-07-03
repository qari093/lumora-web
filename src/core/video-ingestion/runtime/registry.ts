import type { ProviderAdapter } from "./adapter";

const registry = new Map<string, ProviderAdapter>();

export function registerProviderAdapter(
  adapter: ProviderAdapter,
): ProviderAdapter {
  registry.set(adapter.provider.id, adapter);
  return adapter;
}

export function getProviderAdapter(id: string) {
  return registry.get(id);
}

export function listProviderAdapters() {
  return [...registry.values()].sort(
    (a, b) => b.provider.priority - a.provider.priority,
  );
}

export function clearProviderRegistry() {
  registry.clear();
}
