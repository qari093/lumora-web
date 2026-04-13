type PortalKey =
  | "gmar"
  | "nexa"
  | "live"
  | "movies"
  | "fyp"
  | "lumaspace"
  | "share";

type InternalAdContent = {
  id: string;
  title: string;
  body: string;
  portal: string;
  route: string;
  cta: string;
  kind: "internal_ad";
  active: boolean;
  createdAt: number;
};

const PORTAL_TEMPLATES: Record<PortalKey, Omit<InternalAdContent, "id" | "createdAt" | "kind" | "active">> = {
  gmar: {
    title: "Enter GMAR Arena",
    body: "Jump into active games, runs, and challenge drops.",
    portal: "GMAR",
    route: "/gmar",
    cta: "Open GMAR",
  },
  nexa: {
    title: "Boost with NEXA",
    body: "Continue your focus, wellness, and upgrade routines.",
    portal: "NEXA",
    route: "/nexa",
    cta: "Open NEXA",
  },
  live: {
    title: "Join Live Now",
    body: "Step into live rooms, creators, and active sessions.",
    portal: "LIVE",
    route: "/live",
    cta: "Open Live",
  },
  movies: {
    title: "Watch CineVerse Picks",
    body: "Discover featured trailers, movies, and fresh drops.",
    portal: "MOVIES",
    route: "/movies",
    cta: "Open Movies",
  },
  fyp: {
    title: "Return to For You",
    body: "Go back to the main intelligent discovery stream.",
    portal: "FYP",
    route: "/fyp",
    cta: "Open FYP",
  },
  lumaspace: {
    title: "Enter LumaSpace",
    body: "Reflect, journal, and continue your personal flow.",
    portal: "LUMASPACE",
    route: "/lumaspace",
    cta: "Open LumaSpace",
  },
  share: {
    title: "Share the Moment",
    body: "Post, share, and push your latest content outward.",
    portal: "SHARE",
    route: "/share",
    cta: "Open Share",
  },
};

export function generateInternalAd(portalKey: string): InternalAdContent | null {
  const key = String(portalKey || "").toLowerCase() as PortalKey;
  const template = PORTAL_TEMPLATES[key];

  if (!template) return null;

  return {
    id: `adgen_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    ...template,
    kind: "internal_ad",
    active: true,
    createdAt: Date.now(),
  };
}
