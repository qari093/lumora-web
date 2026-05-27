import type { VoiceWill } from "./types";

export function createVoiceWill(input: {
  creatorId: string;
  enabled: boolean;
  selectedWorkIds: string[];
  approvedAt?: string;
}): VoiceWill {
  return {
    creatorId: input.creatorId,
    enabled: input.enabled,
    selectedWorkIds: input.enabled ? [...new Set(input.selectedWorkIds)].slice(0, 24) : [],
    approvedAt: input.enabled ? input.approvedAt : undefined
  };
}

export function canUseVoiceWill(voiceWill: VoiceWill): boolean {
  return voiceWill.enabled && voiceWill.selectedWorkIds.length > 0 && typeof voiceWill.approvedAt === "string";
}
