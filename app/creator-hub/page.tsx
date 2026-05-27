import BreathingDashboard from "@/src/components/creator-alchemy/BreathingDashboard";
import { buildCreatorHubRuntimeSnapshot } from "@/src/core/creator-alchemy/runtime";

export const metadata = {
  title: "Lumora Creator Hub",
  description: "A breathing creator dashboard powered by Lumora Creator Alchemy Ω∞."
};

export default function CreatorHubPage() {
  const snapshot = buildCreatorHubRuntimeSnapshot();

  return (
    <section aria-label="Lumora Creator Hub" data-lumora="creator-hub-runtime">
      <BreathingDashboard model={snapshot.dashboard} />
    </section>
  );
}
