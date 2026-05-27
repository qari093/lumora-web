export interface RuntimeConsolidationSealInput {
  requiredLocks: string[];
  existingLocks: string[];
  reports: string[];
}

export interface RuntimeConsolidationSealReport {
  generatedAt: string;
  status: "PASS" | "FAILED";
  totalLocks: number;
  presentLocks: number;
  missingLocks: string[];
  totalReports: number;
  features: {
    routeInventory: boolean;
    domainOwnership: boolean;
    duplicateAudit: boolean;
    orchestrators: boolean;
    apiContract: boolean;
    deprecations: boolean;
    eventBus: boolean;
    persistenceBoundary: boolean;
    activationHierarchy: boolean;
    observability: boolean;
    buildDebtControl: boolean;
  };
  finalLock: string;
}
