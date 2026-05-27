export type VoiceEcho = {
  enabled: boolean;
  audioUrl?: string;
};

export function buildVoiceEcho(input?: { audioUrl?: string }): VoiceEcho {
  if (!input?.audioUrl) return { enabled: false };
  return { enabled: true, audioUrl: input.audioUrl };
}
