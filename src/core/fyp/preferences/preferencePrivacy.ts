export const FYP_PREFERENCE_PRIVACY = {
  localFirst: true,
  cloudBackupOptional: true,
  userDeletable: true,
  noSensitiveInference: true
} as const;

export function validatePreferencePrivacy(): boolean {
  return (
    FYP_PREFERENCE_PRIVACY.localFirst &&
    FYP_PREFERENCE_PRIVACY.cloudBackupOptional &&
    FYP_PREFERENCE_PRIVACY.userDeletable &&
    FYP_PREFERENCE_PRIVACY.noSensitiveInference
  );
}
