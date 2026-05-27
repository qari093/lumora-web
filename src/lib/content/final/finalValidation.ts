import { ALL_SOURCE_ADAPTERS } from "@/src/lib/content/adapters/allAdapters";

export function validateFinalSystem() {
  return {
    adapterCount: ALL_SOURCE_ADAPTERS.length,
    hasMinimumAdapters: ALL_SOURCE_ADAPTERS.length >= 45,
    restrictedSourcesExcluded: !ALL_SOURCE_ADAPTERS.some(s =>
      s.id === "cern" || s.id === "open-planet"
    ),
  };
}
