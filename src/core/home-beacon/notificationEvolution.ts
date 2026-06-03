export const NOTIFICATION_EVOLUTION = {
  redBadgesRemoved: true,
  lightSignalsEnabled: true,
  signalMemoryEnabled: true,
  groupedSignalsEnabled: true
};

export function notificationEvolutionReady() {
  return (
    NOTIFICATION_EVOLUTION.redBadgesRemoved &&
    NOTIFICATION_EVOLUTION.lightSignalsEnabled &&
    NOTIFICATION_EVOLUTION.signalMemoryEnabled &&
    NOTIFICATION_EVOLUTION.groupedSignalsEnabled
  );
}
