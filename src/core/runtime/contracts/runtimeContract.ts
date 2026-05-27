export type RuntimeContract = {
  id: string;
  enabled: boolean;
  version: string;
};

export const runtimeContract: RuntimeContract = {
  id: "lumora-runtime",
  enabled: true,
  version: "1.0.0"
};
