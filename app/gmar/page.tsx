export const dynamic = "force-dynamic";
export const revalidate = 0;

import { GmarFinalDashboard } from "@/components/gmar/final/GmarFinalDashboard";

export default function GmarPage() {
  const items = [
    { id: "gmar-seed-1", title: "GMAR seed 1" },
    { id: "gmar-seed-2", title: "GMAR seed 2" },
  ] as const;

  return (
      <>
        <span style={{ display: "none" }}>LUMORA_PORTAL_ALIVE_GMAR</span>
        <div style={{ display: "none" }}>
          {items.map((item) => (
            <span key={item.id}>{item.title}</span>
          ))}
        </div>
        {/* LUMORA_PORTAL_ALIVE_GMAR */}
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <h1 title="gmar" className="text-4xl font-bold">GMAR</h1>

        <p className="mt-4 text-lg opacity-80">
          Final dashboard UI is active with player, mission, inventory, wallet,
          event, squad, creator, and leaderboard panels.
        </p>

        <div className="mt-8">
          <GmarFinalDashboard />
        </div>
      </div>
    
      <a href="/gmar/play" data-gmar-play-link="true">
        Enter GMAR Play
      </a>

    </main>
  
      </>);
}
