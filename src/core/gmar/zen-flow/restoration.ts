export type MirrorRestoration = {
  contributesToMirrorHour: true;
  restorationPoints: number;
  grantsPower: false;
};

export function createZenFlowRestoration(minutesPlayed: number): MirrorRestoration {
  return {
    contributesToMirrorHour: true,
    restorationPoints: Math.max(0, Math.min(100, Math.round(minutesPlayed * 4))),
    grantsPower: false,
  };
}
