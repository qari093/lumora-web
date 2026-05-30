import BreathingDashboard from "@/components/creator-alchemy/BreathingDashboard";
import {
  SAMPLE_BREATHING_DASHBOARD_INPUT,
  buildBreathingDashboard
} from "@/src/core/creator-alchemy/dashboard/breathingDashboard";
import {
  buildCreatorHubRuntimeSnapshot
} from "@/src/core/creator-alchemy/runtime/creatorHubRuntime";

export default function CreatorHubPage() {
  const snapshot = buildCreatorHubRuntimeSnapshot();
  const dashboard = snapshot.dashboard ?? buildBreathingDashboard(SAMPLE_BREATHING_DASHBOARD_INPUT);

  return (
    <main data-creator-hub="sanctuary">
      <section>
        <p>Creator Hub keeps sanctuary tone, quiet gifts, constellations, moderation, launch readiness, and live data wiring connected.</p>
      </section>
      <BreathingDashboard model={dashboard} />
    </main>
  );
}

