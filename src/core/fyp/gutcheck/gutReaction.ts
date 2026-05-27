import type {
  GutCheckResult,
  GutCheckSession
} from "./types";

export function finalizeGutCheck(input: {
  session: GutCheckSession;
  strongestClipId: string;
}): GutCheckResult {
  const strongest =
    input.session.clips.find(
      clip => clip.contentId === input.strongestClipId
    );

  if (!strongest) {
    throw new Error("Gut Check strongest clip not found.");
  }

  return {
    dominantMode: strongest.mode,
    emotionalSignature:
      `${strongest.mode}_surge`,
    adrenalineIndex:
      strongest.voltage,
    shareCardReady: true
  };
}
