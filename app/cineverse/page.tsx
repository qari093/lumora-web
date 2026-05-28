import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function CineVersePage() {
  return (
    <LumoraPortalPage
      title="CineVerse"
      eyebrow="Cinema discovery portal"
      description="CineVerse now exposes a polished portal for open-canon cinema, teaser browsing, cinematic FYP, metadata, reactions, and creator commentary."
      actions={[
        { label: "Cine FYP", href: "/cineverse/fyp" },
        { label: "Open Canon", href: "/cineverse/open-canon" },
        { label: "Movies API", href: "/api/movies/catalog" }
      ]}
      signals={[
        { label: "Mode", value: "Cinematic" },
        { label: "Rights", value: "Legal Gate" },
        { label: "Feed", value: "FYP Bridge" }
      ]}
      modules={[
        "Trailer Hero",
        "Teaser Browse",
        "Metadata Cards",
        "Emotional Tags",
        "Community Reactions",
        "Creator Commentary",
        "Open Canon",
        "Cinematic FYP"
      ]}
    />
  );
}
