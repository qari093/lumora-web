import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function MusicPage() {
  return (
    <LumoraPortalPage
      title="Lumora Echo"
      eyebrow="Music and emotional sound portal"
      description="Explore sound-led moments, emotional listening paths, calming audio surfaces, creator tracks, and FYP-connected music discovery inside Lumora."
      actions={[
        { label: "Open Music", href: "/music/play" },

        { label: "Back to FYP", href: "/fyp" }
      ]}
      signals={[
        { label: "Mode", value: "Listening" },
        { label: "Tone", value: "Emotional" },
        { label: "Bridge", value: "FYP + NEXA" }
      ]}
      modules={[
        "Track Discovery",
        "Emotional Playlists",
        "Calm Audio",
        "Creator Tracks",
        "Sound Reactions",
        "Music Cards",
        "FYP Audio Bridge",
        "Wellness Sound"
      ]}
    />
  );
}
