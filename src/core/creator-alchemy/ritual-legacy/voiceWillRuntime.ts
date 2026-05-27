import type { VoiceWillRuntime } from "./types";

export function buildVoiceWillRuntime(input: VoiceWillRuntime): VoiceWillRuntime {
  return {
    ...input,
    selectedWorks: input.enabled && input.approved ? input.selectedWorks.slice(0, 24) : []
  };
}

export function canActivateVoiceWill(runtime: VoiceWillRuntime): boolean {
  return runtime.enabled && runtime.approved && runtime.selectedWorks.length > 0;
}
