export type GmarActivationItem = {
  id: string;
  title: string;
  category: "mission" | "economy" | "game" | "reward";
  players: number;
  description: string;
  href: string;
};

export const gmarActivationItems: GmarActivationItem[] = [
  {
    id: "mission-surface",
    title: "Mission Surface",
    category: "mission",
    players: 42,
    description: "Founder-visible mission runtime and challenge discovery.",
    href: "/gmar"
  },
  {
    id: "pulse-store",
    title: "Pulse Store",
    category: "economy",
    players: 27,
    description: "ZenEconomy reward and cosmetic visibility layer.",
    href: "/wallet"
  },
  {
    id: "game-runtime",
    title: "Game Runtime",
    category: "game",
    players: 19,
    description: "GMAR gameplay bridge and runtime verification surface.",
    href: "/live"
  },
  {
    id: "reward-engine",
    title: "Reward Engine",
    category: "reward",
    players: 33,
    description: "Founder-safe reward flow with no public payouts enabled.",
    href: "/wallet"
  }
];

export function getGmarActivationSummary() {
  return {
    status: "GMAR_ACTIVATED_FOR_FOUNDER_REVIEW",
    itemCount: gmarActivationItems.length,
    visiblePlayers: gmarActivationItems.reduce((a, b) => a + b.players, 0),
    liveRewardsEnabled: false,
    testerInvitesBlocked: true,
    safeMode: true
  };
}
