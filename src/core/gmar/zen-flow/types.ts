export type ZenFlowPhase =
  | "arrival"
  | "breath_sync"
  | "light_path"
  | "soft_challenge"
  | "gratitude_close";

export type ZenFlowSession = {
  id: string;
  phases: ZenFlowPhase[];
  scoringEnabled: false;
  stressPressure: false;
  mirrorHourCompatible: true;
};
