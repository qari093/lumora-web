import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function MoviesPage() {
  return (
    <LumoraPortalPage
      title="CineVerse"
      eyebrow="Movies and emotional discovery"
      description="Explore film-inspired discovery, trailer-style moments, watch paths, emotional reactions, and safe CineVerse content inside Lumora."
      actions={[
        { label: "Open Movie Catalog", href: "/api/movies/catalog" },
        { label: "Movies Health", href: "/api/movies/health" },
        { label: "Back to FYP", href: "/fyp" }
      ]}
      signals={[
        { label: "Mode", value: "Discovery" },
        { label: "Content", value: "Safe Seeds" },
        { label: "Bridge", value: "FYP + Reactions" }
      ]}
      modules={[
        "Movie Discovery",
        "Trailer Moments",
        "Emotional Tags",
        "Watchlist",
        "CineVerse FYP",
        "Reaction Rooms",
        "Safe Content Gate",
        "Share Cards"
      ]}
    />
  );
}
