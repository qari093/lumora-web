import type { CanonicalVideoAsset } from "../runtime";
import type { ValidationBridgeStep } from "./types";

export function validateFypPlayback(asset: CanonicalVideoAsset): ValidationBridgeStep {
  return {
    id: "fyp_playback",
    surface: "fyp",
    passed: Boolean(asset.sourceUrl && asset.mimeType.startsWith("video/")),
    detail: asset.sourceUrl,
  };
}

export function validateVoiceCheck(asset: CanonicalVideoAsset): ValidationBridgeStep {
  return {
    id: "voice_check",
    surface: "voice_check",
    passed: asset.hasAudio === true,
    detail: asset.hasAudio ? "audio_present" : "audio_missing",
  };
}

export function validateLumaSpaceMemorySave(asset: CanonicalVideoAsset): ValidationBridgeStep {
  return {
    id: "lumaspace_memory_save",
    surface: "lumaspace",
    passed: asset.tags.includes("lumaspace") || asset.metadata.validationPool === true,
    detail: "memory_star_ready",
  };
}

export function validateUniversalShareReadiness(asset: CanonicalVideoAsset): ValidationBridgeStep {
  return {
    id: "universal_share_ready",
    surface: "universal_share",
    passed: asset.tags.includes("fyp") || asset.tags.includes("validation"),
    detail: "share_runtime_ready",
  };
}
