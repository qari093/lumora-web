export type LegendaryArchive = {
  archiveId: string;
  creatorId: string;
  preserved: boolean;
  indexed: boolean;
};

export function archiveLegendaryRelease(input: {
  creatorId: string;
}): LegendaryArchive {
  return {
    archiveId: `archive_${input.creatorId}`,
    creatorId: input.creatorId,
    preserved: true,
    indexed: true
  };
}
