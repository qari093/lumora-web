export type FinalSealCheck = {
  name: string;
  passed: boolean;
};

export type LumaSpaceOmegaSeal = {
  system: "LumaSpace Ω∞";
  totalChecks: number;
  passedChecks: number;
  integrationPercent: number;
  sealed: boolean;
};
