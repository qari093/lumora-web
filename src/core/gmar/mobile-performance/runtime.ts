export type MobilePerformanceProfile = {
  batterySafe: boolean;
  fpsGuarded: boolean;
  lowEndDeviceMode: boolean;
  hapticSafe: boolean;
  maxParticles: number;
  targetFps: 30 | 60;
};

export function createMobilePerformanceProfile(lowEnd = false): MobilePerformanceProfile {
  return {
    batterySafe: true,
    fpsGuarded: true,
    lowEndDeviceMode: lowEnd,
    hapticSafe: true,
    maxParticles: lowEnd ? 120 : 420,
    targetFps: lowEnd ? 30 : 60,
  };
}

export function mobilePerformanceHealthy(profile = createMobilePerformanceProfile()): boolean {
  return (
    profile.batterySafe &&
    profile.fpsGuarded &&
    profile.hapticSafe &&
    profile.maxParticles <= 420 &&
    (profile.targetFps === 30 || profile.targetFps === 60)
  );
}
