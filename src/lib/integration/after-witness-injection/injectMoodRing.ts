export function injectMoodRingIntoDashboard(dashboard: any, moodRing: any) {
  return {
    ...dashboard,
    moodRing: {
      visible: true,
      ...moodRing,
    },
  };
}
