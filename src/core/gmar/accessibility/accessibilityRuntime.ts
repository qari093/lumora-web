export function accessibilityProfile(enabled: boolean) {
  return {
    subtitles: enabled,
    contrast: enabled
  };
}
