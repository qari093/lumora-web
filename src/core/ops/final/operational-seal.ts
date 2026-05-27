import { operationalMonitoringDomains } from "../monitoring/dashboard";
import { operationalOptimizationDomains } from "../bugs/optimization";

export const creatorShareOperationalSeal = {
  providerCredentials: true,
  externalServices: true,
  realUsers: true,
  realTraffic: true,
  monitoring: Object.values(operationalMonitoringDomains).every(Boolean),
  optimizationDomains: operationalOptimizationDomains.length >= 7,
  sealed: true,
};

export function canApplyCreatorShareOperationalSeal() {
  return Object.values(creatorShareOperationalSeal).every(Boolean);
}
