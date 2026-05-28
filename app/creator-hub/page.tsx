import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function CreatorHubPage() {
  return (
    <LumoraPortalPage
      title="Creator Hub"
      eyebrow="Creator civilization portal"
      description="Creator Hub now mounts as a polished surface for dashboard state, quiet gifts, constellations, creator rituals, moderation, launch readiness, and live data wiring."
      actions={[
        { label: "Creator Dashboard", href: "/creator/dashboard" },
        { label: "Creator Hub API", href: "/api/creator/hub" },
        { label: "Alchemy Health", href: "/api/creator-alchemy/health" }
      ]}
      signals={[
        { label: "Mode", value: "Creator OS" },
        { label: "Economy", value: "Quiet Gifts" },
        { label: "Safety", value: "Moderated" }
      ]}
      modules={[
        "Dashboard",
        "First Breath",
        "Constellations",
        "Quiet Gifts",
        "Creator Identity",
        "Live Sync",
        "Moderation",
        "Launch Gates"
      ]}
    />
  );
}
