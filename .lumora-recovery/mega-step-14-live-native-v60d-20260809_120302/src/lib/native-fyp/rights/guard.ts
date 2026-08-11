import type { NativeFypVideo } from '../schema';
import { isNativeFypSourceAllowed } from '../policy';
import { NATIVE_FYP_LICENSE_REGISTRY } from './licenseRegistry';

export function validateRightsForNativeFyp(video: NativeFypVideo): {
  allowed: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (!isNativeFypSourceAllowed(video.sourceType)) reasons.push('source_not_allowed');
  if (video.rightsStatus !== 'verified') reasons.push('rights_not_verified');

  const rule =
    NATIVE_FYP_LICENSE_REGISTRY[video.licenseType as keyof typeof NATIVE_FYP_LICENSE_REGISTRY];
  if (!rule?.commercialUseAllowed) reasons.push('commercial_use_not_allowed');

  return {
    allowed: reasons.length === 0,
    reasons,
  };
}

export function assertRightsForNativeFyp(video: NativeFypVideo): void {
  const result = validateRightsForNativeFyp(video);
  if (!result.allowed) {
    throw new Error(`Native FYP rights blocked: ${result.reasons.join(',')}`);
  }
}
