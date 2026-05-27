import type {
  ApiContractHardeningReport,
  ContractStatus
} from "./types";

import {
  API_ROUTE_FIXTURES
} from "./fixtures";

import {
  inspectApiContract
} from "./inspect";

export function buildApiContractHardeningReport():
ApiContractHardeningReport {
  const inspections =
    API_ROUTE_FIXTURES.map(inspectApiContract);

  const passedRoutes =
    inspections.filter(
      (x) => x.status === "PASS"
    ).length;

  const warningRoutes =
    inspections.filter(
      (x) => x.status === "WARNING"
    ).length;

  const failedRoutes =
    inspections.filter(
      (x) => x.status === "FAILED"
    ).length;

  let status: ContractStatus = "PASS";

  if (failedRoutes > 0) {
    status = "FAILED";
  } else if (warningRoutes > 0) {
    status = "WARNING";
  }

  return {
    generatedAt: new Date().toISOString(),
    status,
    totalRoutes: inspections.length,
    passedRoutes,
    warningRoutes,
    failedRoutes,
    inspections
  };
}
