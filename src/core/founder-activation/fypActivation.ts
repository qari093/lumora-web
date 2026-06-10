export type FypActivationItem = {
  id: string;
  title: string;
  portal: "FYP" | "Live" | "GMAR" | "Zendoro" | "NEXA";
  type: "video" | "mission" | "commerce" | "signal";
  description: string;
  action: string;
  href: string;
};

export const fypActivationItems: FypActivationItem[] = [
  {
    id: "fyp-native-feed",
    title: "Native Lumora Feed",
    portal: "FYP",
    type: "video",
    description: "A real starter feed surface for visual discovery, portal movement, and content review.",
    action: "Open feed",
    href: "/api/fyp/native-feed"
  },
  {
    id: "live-pulse",
    title: "Live Pulse Rooms",
    portal: "Live",
    type: "signal",
    description: "A live discovery bridge into active room surfaces and public runtime state.",
    action: "Check live",
    href: "/live"
  },
  {
    id: "gmar-mission",
    title: "GMAR Mission Surface",
    portal: "GMAR",
    type: "mission",
    description: "A game-mission entry point for early founder validation of GMAR loops.",
    action: "Enter GMAR",
    href: "/gmar"
  },
  {
    id: "zendoro-discovery",
    title: "Zendoro Discovery",
    portal: "Zendoro",
    type: "commerce",
    description: "A safe-mode commerce bridge. Checkout remains protected until founder approval.",
    action: "View shop",
    href: "/zendoro"
  },
  {
    id: "nexa-guidance",
    title: "NEXA Guidance",
    portal: "NEXA",
    type: "signal",
    description: "A calm AI guidance entry point for validating NEXA as a real ecosystem module.",
    action: "Open NEXA",
    href: "/nexa"
  }
];

export function getFypActivationSummary() {
  return {
    status: "FYP_ACTIVATED_FOR_FOUNDER_REVIEW",
    itemCount: fypActivationItems.length,
    videoSignals: fypActivationItems.filter((item) => item.type === "video").length,
    portalBridges: Array.from(new Set(fypActivationItems.map((item) => item.portal))).length,
    safeMode: true
  };
}
