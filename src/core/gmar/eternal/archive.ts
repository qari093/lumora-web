export type EternalArchive = {
  enabled: boolean;
  civilizationRetentionYears: number;
  mythologyPreserved: boolean;
  legacyProtected: boolean;
};

export function createEternalArchive(): EternalArchive {
  return {
    enabled: true,
    civilizationRetentionYears: 100,
    mythologyPreserved: true,
    legacyProtected: true,
  };
}
