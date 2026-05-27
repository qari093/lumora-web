export function validateDashboardLiveRefresh(dashboard: any) {
  const ok = Boolean(
    dashboard?.runtimeState?.connected === true &&
    dashboard?.identityHeader?.vanityMetricsHidden === true &&
    dashboard?.witnessedAnchor?.visible === true &&
    dashboard?.nextCircleCountdown,
  );

  return {
    ok,
    reason: ok ? "dashboard_live_refresh_valid" : "dashboard_live_refresh_incomplete",
  };
}
