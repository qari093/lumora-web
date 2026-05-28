import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function LivePage() {
  return (
    <LumoraPortalPage
      title="Lumora Live"
      eyebrow="Realtime presence portal"
      description="Live rooms, creator rituals, pulse presence, safety overlays, sparks, reactions, and community gravity now mount through the recovered Lumora visual system."
      actions={[
        { label: "Open Rooms", href: "/api/live/rooms/public" },
        { label: "Live Health", href: "/api/live/health" },
        { label: "Portal Hubs", href: "/api/live/portal-hubs" }
      ]}
      signals={[
        { label: "Mode", value: "Realtime" },
        { label: "Safety", value: "Guardian Layer" },
        { label: "Bridge", value: "FYP + GMAR" }
      ]}
      modules={[
        "Live Lobby",
        "PulseSphere Lite",
        "Room Grid",
        "Guardian Overlay",
        "Replay Layer",
        "Squad Join",
        "Creator Live Cards",
        "Monetization Overlay"
      ]}
    />
  );
}
