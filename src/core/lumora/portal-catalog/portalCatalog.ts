export type PortalStatus = "active" | "sealed" | "planned" | "post_launch";

export type LumoraPortal = {
  id: string;
  name: string;
  route: string;
  status: PortalStatus;
  purpose: string;
  coreFeatures: string[];
  integrations: string[];
  monetization: string[];
};

export const lumoraPortals: LumoraPortal[] = [
  {
    id: "fyp",
    name: "Lumora FYP",
    route: "/fyp",
    status: "sealed",
    purpose: "Main discovery feed for videos, trends, emotional signals, creator reach, and native monetization.",
    coreFeatures: ["Real FYP engine", "LCE-X+ discovery", "trend intelligence", "safe media runtime", "native ad cards"],
    integrations: ["Echo", "Zencoin", "Creator tools", "Ads engine"],
    monetization: ["native feed ads", "creator monetization", "sponsored discovery"]
  },
  {
    id: "gmar",
    name: "GMAR Playground",
    route: "/gmar",
    status: "sealed",
    purpose: "Exclusive in-platform games portal with no downloads and ZenEconomy-connected engagement.",
    coreFeatures: ["Astro Shooter", "Zen Flow", "future Pulse Grid", "event loops", "FOMO guardrails"],
    integrations: ["Zencoin", "Live rooms", "Echo sound", "ads"],
    monetization: ["cosmetics", "event rewards", "native game ads"]
  },
  {
    id: "echo",
    name: "Lumora Echo",
    route: "/echo",
    status: "sealed",
    purpose: "Spotify-level emotional music and atmosphere portal.",
    coreFeatures: ["Atmosphere player", "morph engine", "memory trails", "mood rooms", "daily rituals"],
    integrations: ["NEXA", "Zencoin", "LumaSpace", "CineVerse"],
    monetization: ["premium subscription", "atmosphere packs", "creator audio packs"]
  },
  {
    id: "nexa",
    name: "NEXA GX Ω∞",
    route: "/nexa",
    status: "sealed",
    purpose: "Wellness, sports, nutrition, recovery, hormonal, and calm-performance operating system.",
    coreFeatures: ["Body Weather", "Daily Movement Sculpture", "Nourish engine", "Recovery engine", "Sanctuaries"],
    integrations: ["Echo", "Zencoin", "Wearables", "LumaSpace"],
    monetization: ["NEXA Premium", "Echo bundle", "creator wellness packs"]
  },
  {
    id: "zencoin",
    name: "Zencoin Wallet Ω",
    route: "/zencoin",
    status: "sealed",
    purpose: "Closed-loop emotional economy wallet for Lumora.",
    coreFeatures: ["ZC credits", "Zen Pulse", "ledger", "Lumora Shield", "calm spending"],
    integrations: ["Echo", "NEXA", "GMAR", "FYP", "Creator economy"],
    monetization: ["IAP credits", "premium packs", "creator support"]
  },
  {
    id: "live",
    name: "Lumora Live",
    route: "/live",
    status: "active",
    purpose: "Live presence, creator rooms, community events, and real-time emotional connection.",
    coreFeatures: ["Live rooms", "moderation", "presence states", "afterglow", "creator events"],
    integrations: ["Echo", "GMAR", "Zencoin", "Creator tools"],
    monetization: ["ticketed events", "creator support", "native sponsorships"]
  },
  {
    id: "lumaspace",
    name: "LumaSpace Ω∞",
    route: "/lumaspace",
    status: "sealed",
    purpose: "Emotional self-reflection, spaces, memory, rituals, and civilization layer.",
    coreFeatures: ["Reflection journals", "Shadow journals", "emotional worlds", "ritual systems", "Sanctuary spaces"],
    integrations: ["Echo", "NEXA", "Zencoin", "Live"],
    monetization: ["premium spaces", "ritual packs", "creator experiences"]
  },
  {
    id: "cineverse",
    name: "Lumora CineVerse",
    route: "/cineverse",
    status: "planned",
    purpose: "Movie, serial, and cinematic entertainment portal.",
    coreFeatures: ["HD movies", "Indian/Punjabi content", "serials", "trailers", "safe clip system"],
    integrations: ["FYP", "Echo", "Zencoin", "Ads"],
    monetization: ["subscriptions", "ads", "premium access"]
  },
  {
    id: "share",
    name: "Lumora Share",
    route: "/share",
    status: "planned",
    purpose: "Creator sharing, syndication, referral, and viral distribution hub.",
    coreFeatures: ["post sharing", "creator links", "external syndication", "guest viewing", "referral loops"],
    integrations: ["FYP", "Creator tools", "Zencoin", "Ads"],
    monetization: ["creator revenue", "affiliate rewards", "sponsored shares"]
  },
  {
    id: "ads",
    name: "Lumora Ads",
    route: "/ads",
    status: "planned",
    purpose: "Native non-disruptive monetization and local business ad system.",
    coreFeatures: ["Hybrid Radius Engine", "native ads", "campaign dashboard", "fraud controls", "analytics"],
    integrations: ["FYP", "Zendoro", "Zencoin", "LumaCard"],
    monetization: ["local ads", "sponsored cards", "creator campaigns"]
  },
  {
    id: "zendoro",
    name: "Zendoro",
    route: "/zendoro",
    status: "planned",
    purpose: "Commerce/shop ecosystem connected with Lumora attention and ZenEconomy.",
    coreFeatures: ["shops", "products", "checkout", "vendor dashboard", "commerce bridge"],
    integrations: ["Ads", "Zencoin", "FYP", "LumaCard"],
    monetization: ["commerce fees", "vendor plans", "ads"]
  }
];

export function getPortalById(id: string): LumoraPortal | undefined {
  return lumoraPortals.find((portal) => portal.id === id);
}

export function getActivePortals(): LumoraPortal[] {
  return lumoraPortals.filter((portal) => portal.status === "active" || portal.status === "sealed");
}

export function portalCatalogHealthy(): boolean {
  return (
    lumoraPortals.length >= 10 &&
    lumoraPortals.every((portal) =>
      Boolean(portal.id && portal.name && portal.route && portal.purpose && portal.coreFeatures.length)
    )
  );
}
