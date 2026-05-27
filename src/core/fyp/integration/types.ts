export type FypIntegrationModule =
  | "foundation"
  | "core-engine"
  | "modes"
  | "social"
  | "resonance"
  | "pulse"
  | "creator"
  | "revenue"
  | "culture"
  | "trust"
  | "runtime";

export type FypIntegrationStatus = {
  module: FypIntegrationModule;
  ready: boolean;
  lockFile: string;
};

export type FypSystemIntegrationReport = {
  totalModules: number;
  readyModules: number;
  complete: boolean;
  missingModules: FypIntegrationModule[];
};
