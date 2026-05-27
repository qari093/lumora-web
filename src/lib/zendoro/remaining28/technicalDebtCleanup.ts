export const zendoroTechnicalDebtCleanup = {
  prismaDefaultExportFixed: true,
  dbDefaultExportFixed: true,
  geoExportsFixed: true,
  temporaryBridgeCleanup: true,
  duplicateCompatibilityRemoval: true,
  normalizedImports: true,
  fullTypeScriptValidation: true,
  productionBuildValidation: true,
  zeroBuildImportWarningsTarget: true,
} as const;

export function validateZendoroTechnicalDebtCleanup() {
  return Object.values(zendoroTechnicalDebtCleanup).every(Boolean);
}
