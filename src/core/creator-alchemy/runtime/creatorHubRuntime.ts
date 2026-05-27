import {
  SAMPLE_BREATHING_DASHBOARD_INPUT,
  buildBreathingDashboard,
  type BreathingDashboardModel
} from "@/src/core/creator-alchemy/dashboard";
import { runCreatorAlchemyCivilizationSeal } from "@/src/core/creator-alchemy/seal";

export interface CreatorHubRuntimeSnapshot {
  ok: boolean;
  generatedAt: string;
  system: "Lumora Creator Alchemy Ω∞";
  seal: string;
  dashboard: BreathingDashboardModel;
}

export function buildCreatorHubRuntimeSnapshot(): CreatorHubRuntimeSnapshot {
  const seal = runCreatorAlchemyCivilizationSeal();
  const dashboard = buildBreathingDashboard(SAMPLE_BREATHING_DASHBOARD_INPUT);

  return {
    ok: seal.ok,
    generatedAt: new Date().toISOString(),
    system: "Lumora Creator Alchemy Ω∞",
    seal: seal.seal,
    dashboard
  };
}

export function validateCreatorHubRuntimeSnapshot(snapshot: CreatorHubRuntimeSnapshot): boolean {
  return (
    snapshot.ok === true &&
    snapshot.system === "Lumora Creator Alchemy Ω∞" &&
    snapshot.seal === "LUMORA_CREATOR_ALCHEMY_CIVILIZATION_SEAL" &&
    snapshot.dashboard.zones.includes("whisper_panel") &&
    snapshot.dashboard.zones.includes("quiet_impact") &&
    snapshot.dashboard.quietImpact.horizonProgress >= 0 &&
    snapshot.dashboard.quietImpact.horizonProgress <= 1
  );
}
