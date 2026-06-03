"use client";

import {
  getDashboardWidgets,
  interactionBridgeReady,
  notificationEvolutionReady
} from "@/src/core/home-beacon";

export default function HomeBeaconDashboard() {
  return (
    <div
      data-testid="home-beacon-dashboard"
      data-dashboard={getDashboardWidgets().length}
      data-interactions={interactionBridgeReady()}
      data-notifications={notificationEvolutionReady()}
    />
  );
}
