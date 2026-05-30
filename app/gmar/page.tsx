import Link from "next/link";
import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function GmarPage() {
  return (
    <main>
      <Link href="/gmar/play">Play GMAR</Link>
      <LumoraPortalPage
        title="GMAR Playground"
        eyebrow="Games civilization portal"
        description="GMAR now has a visible launch surface for game discovery, player identity, missions, Zencoin economy, live presence, and community rooms."
        actions={[
          { label: "Play", href: "/gmar/play" },
          { label: "GMAR Health", href: "/api/gmar/health" },
          { label: "Public Ready", href: "/api/gmar/public-ready" }
        ]}
        signals={[
          { label: "Mode", value: "Playable Hub" },
          { label: "Economy", value: "Zencoin Linked" },
          { label: "Community", value: "Live Rooms" }
        ]}
        modules={[
          "Game Launcher",
          "Player State",
          "Missions",
          "Inventory",
          "World Events",
          "Squads",
          "Creator Games",
          "Anti-Cheat"
        ]}
      />
    </main>
  );
}

