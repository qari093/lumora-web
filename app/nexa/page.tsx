import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function NexaPage() {
  return (
    <LumoraPortalPage
      title="NEXA Sanctuary"
      eyebrow="Human optimization portal"
      description="NEXA is restored as a calm visual portal for recovery, movement, nourishment, sleep, breath, emotional companion systems, and Zen Economy premium flows."
      actions={[
        { label: "NEXA Status", href: "/api/nexa/status" },
        { label: "NEXA Health", href: "/api/nexa/health" },
        { label: "Summary", href: "/api/nexa/summary" }
      ]}
      signals={[
        { label: "Mode", value: "Sanctuary" },
        { label: "Tone", value: "Calm" },
        { label: "Economy", value: "Premium Ready" }
      ]}
      modules={[
        "Wellness Dashboard",
        "Breathing UI",
        "Recovery Visualization",
        "Emotional Companion",
        "Health Metrics",
        "Ritual Overlay",
        "Trust Indicators",
        "Sanctuary Community"
      ]}
    />
  );
}
