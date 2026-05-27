import { createGmarDashboardState } from "@/src/core/gmar/dashboard-active/dashboardState";

export function GmarDashboard() {
  const dashboard = createGmarDashboardState({
    userId: "local_demo_user",
    displayName: "GMAR Player"
  });

  return (
    <section className="rounded-2xl border p-6">
      <div>
        <p className="text-sm uppercase tracking-wide opacity-60">
          GMAR Playable Baseline
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {dashboard.displayName}
        </h2>

        <p className="mt-2 text-sm opacity-70">
          Status: {dashboard.readiness}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-60">Level</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.level}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-60">XP</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.xp}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-60">Zencoin</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.zencoinBalance}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <p className="text-sm opacity-60">Active Mission</p>
        <p className="mt-1 font-medium">{dashboard.activeMissionTitle}</p>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <p className="text-sm opacity-60">World</p>
        <p className="mt-1 font-medium">
          {dashboard.activeWorld} / {dashboard.activeZone}
        </p>
      </div>
    </section>
  );
}
