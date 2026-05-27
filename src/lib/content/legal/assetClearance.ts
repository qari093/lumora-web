import { validateLicense } from "./licenseNormalizer";
import { buildAttributionRecord, type AttributionInput } from "./attribution";

export type MediaAssetClearanceInput = AttributionInput & {
  hasAudio: boolean;
  playableUrl?: string;
  durationSeconds?: number;
  commercialUse?: boolean;
};

export function validateMediaAssetForLumora(input: MediaAssetClearanceInput) {
  const license = validateLicense(input.license);
  const attribution = buildAttributionRecord(input);

  const audioOk = input.hasAudio === true;
  const playableOk = Boolean(input.playableUrl);
  const duration = Number(input.durationSeconds || 0);
  const durationOk = duration === 0 || (duration >= 6 && duration <= 180);
  const commercialOk = input.commercialUse !== false;

  const ok =
    license.ok &&
    attribution.valid &&
    audioOk &&
    playableOk &&
    durationOk &&
    commercialOk;

  return {
    ok,
    license,
    attribution,
    audioOk,
    playableOk,
    durationOk,
    commercialOk,
    reasons: [
      !license.ok ? license.reason : "",
      !attribution.valid ? "invalid_attribution_or_source_url" : "",
      !audioOk ? "missing_audio" : "",
      !playableOk ? "missing_playable_url" : "",
      !durationOk ? "invalid_duration" : "",
      !commercialOk ? "commercial_use_not_allowed" : "",
    ].filter(Boolean),
  };
}
