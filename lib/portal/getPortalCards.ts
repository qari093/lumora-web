import { getPortalStatusManifest } from "@/lib/portal/getPortalStatusManifest";

const META: Record<string, { title: string; subtitle: string }> = {
  fyp: { title: "For You", subtitle: "Personalized discovery stream" },
  gmar: { title: "GMAR", subtitle: "Games and challenge arena" },
  nexa: { title: "NEXA", subtitle: "Wellness and self-upgrade systems" },
  cineverse: { title: "CineVerse", subtitle: "Movies and cinematic discovery" },
  live: { title: "Live", subtitle: "Realtime rooms and sessions" },
  wallet: { title: "Wallet", subtitle: "Balance, rewards, and transactions" },
  profile: { title: "Profile", subtitle: "Identity, settings, and personal hub" },
};

export function getPortalCards() {
  return getPortalStatusManifest().map((portal) => ({
    key: portal.key,
    path: portal.path,
    enabled: portal.enabled,
    title: META[portal.key]?.title ?? portal.key,
    subtitle: META[portal.key]?.subtitle ?? "Portal",
    status: portal.status,
  }));
}
