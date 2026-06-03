export type DashboardWidget =
  | "wallet"
  | "pulse"
  | "notifications"
  | "dailyGoal"
  | "currentPortal"
  | "quickActions";

export const HOME_BEACON_DASHBOARD = {
  enabled: true,
  widgets: [
    "wallet",
    "pulse",
    "notifications",
    "dailyGoal",
    "currentPortal",
    "quickActions"
  ] as DashboardWidget[],
  position: "bottom"
};

export function getDashboardWidgets() {
  return [...HOME_BEACON_DASHBOARD.widgets];
}
