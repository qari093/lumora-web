export const ARCHIVE_PRODUCTION_LOCK = {
  realContentOnly: true,
  noAiGeneratedContent: true,
  archiveEnabled: true,
  audioRequiredRatio: 0.3,
  addictionLoopEnabled: true,
  retentionLoopEnabled: true,
  microHookEnabled: true,
  viralEngineEnabled: true,
  curiosityEngineEnabled: true,
};

export function validateProductionReadiness(report: any) {
  return {
    ok:
      report.total > 300 &&
      report.diversity > 5 &&
      report.audioRatio >= 0.3,
    noAiEnabled: ARCHIVE_PRODUCTION_LOCK.noAiGeneratedContent,
    archiveEnabled: ARCHIVE_PRODUCTION_LOCK.archiveEnabled,
  };
}
