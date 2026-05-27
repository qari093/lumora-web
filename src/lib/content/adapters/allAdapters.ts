import { SPACE_SCIENCE_ADAPTERS } from "./spaceScienceAdapters";
import { ARCHIVE_GOVERNMENT_ADAPTERS } from "./archiveGovernmentAdapters";
import { CULTURAL_LIBRARY_ADAPTERS } from "./culturalLibraryAdapters";
import { STOCK_PLATFORM_ADAPTERS } from "./stockPlatformAdapters";
import { MIXED_LICENSE_ADAPTERS } from "./mixedLicenseAdapters";
import { REGIONAL_SPECIALIZED_ADAPTERS } from "./regionalSpecializedAdapters";
import { EXTRA_APPROVED_ADAPTERS } from "./extraApprovedAdapters";

export const ALL_SOURCE_ADAPTERS = [
  ...SPACE_SCIENCE_ADAPTERS,
  ...ARCHIVE_GOVERNMENT_ADAPTERS,
  ...CULTURAL_LIBRARY_ADAPTERS,
  ...STOCK_PLATFORM_ADAPTERS,
  ...MIXED_LICENSE_ADAPTERS,
  ...REGIONAL_SPECIALIZED_ADAPTERS,
  ...EXTRA_APPROVED_ADAPTERS,
];

export function getEnabledAdapters() {
  return ALL_SOURCE_ADAPTERS.filter((adapter) => adapter.enabled);
}

export async function fetchFromAllAdapters() {
  const out = [];

  for (const adapter of getEnabledAdapters()) {
    const clips = await adapter.fetch();
    out.push(...clips);
  }

  return out;
}
