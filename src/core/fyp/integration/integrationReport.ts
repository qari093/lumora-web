import type {
  FypIntegrationModule,
  FypIntegrationStatus,
  FypSystemIntegrationReport
} from "./types";

import {
  FYP_REQUIRED_MODULES
} from "./moduleRegistry";

export function createFypSystemIntegrationReport(
  statuses: FypIntegrationStatus[]
): FypSystemIntegrationReport {
  const readySet = new Set(
    statuses
      .filter(status => status.ready)
      .map(status => status.module)
  );

  const missingModules: FypIntegrationModule[] =
    FYP_REQUIRED_MODULES.filter(
      module => !readySet.has(module)
    );

  return {
    totalModules: FYP_REQUIRED_MODULES.length,
    readyModules: readySet.size,
    complete: missingModules.length === 0,
    missingModules
  };
}
