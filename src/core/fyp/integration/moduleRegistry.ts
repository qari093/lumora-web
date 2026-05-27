import type {
  FypIntegrationModule,
  FypIntegrationStatus
} from "./types";

export const FYP_REQUIRED_MODULES: FypIntegrationModule[] = [
  "foundation",
  "core-engine",
  "modes",
  "social",
  "resonance",
  "pulse",
  "creator",
  "revenue",
  "culture",
  "trust",
  "runtime"
];

export function createFypIntegrationStatus(input: {
  module: FypIntegrationModule;
  ready: boolean;
}): FypIntegrationStatus {
  return {
    module: input.module,
    ready: input.ready,
    lockFile: `.lumora_fyp_${input.module}_ready`
  };
}
