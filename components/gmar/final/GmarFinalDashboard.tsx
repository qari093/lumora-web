import { createGmarDashboardState } from "@/src/core/gmar/dashboard-active/dashboardState";
import { createGmarDashboardUiState } from "@/src/core/gmar/final-completion/dashboard/dashboardUiState";
import { getAvailableGmarMissions } from "@/src/core/gmar/final-completion/gameplay/content";

export function GmarFinalDashboard() {
  const dashboard = createGmarDashboardState({
    userId: "local_demo_user",
    displayName: "GMAR Player"
  });

  const ui = createGmarDashboardUiState({
    xp: dashboard.xp
  });

  const missions = getAvailableGmarMissions(ui.calculatedLevel);

  return (
    <section className="space-y-6 rounded-2xl border p-6">
      <header>
        <p className="text-sm uppercase tracking-wide opacity-60">
          GMAR Final Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-bold">
          {dashboard.displayName}
        </h2>
        <p className="mt-2 text-sm opacity-70">
          Level {ui.calculatedLevel} · {dashboard.activeWorld} / {dashboard.activeZone}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-60">XP</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.xp}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-60">Zencoin</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.zencoinBalance}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-60">Missions</p>
          <p className="mt-1 text-2xl font-semibold">{missions.length}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-60">Status</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.readiness}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border p-4">
          <h3 className="text-xl font-semibold">Mission Panel</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            {missions.map(mission => (
              <li key={mission.missionId}>
                {mission.title} · {mission.tier} · +{mission.xpReward} XP
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border p-4">
          <h3 className="text-xl font-semibold">System Panels</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li>Inventory panel ready</li>
            <li>Wallet panel ready</li>
            <li>Event panel ready</li>
            <li>Squad panel ready</li>
            <li>Creator panel ready</li>
            <li>Leaderboard panel ready</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
