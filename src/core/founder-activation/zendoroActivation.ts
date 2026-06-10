export type ZendoroActivationSurface = {
  id: string;
  title: string;
  type: "commerce" | "seller" | "trust" | "discovery";
  status: "founder-preview" | "safe-active";
  description: string;
  href: string;
};

export const zendoroActivationSurfaces: ZendoroActivationSurface[] = [
  {
    id: "discovery",
    title: "Product Discovery",
    type: "discovery",
    status: "safe-active",
    description: "Founder-visible product exploration and category browsing.",
    href: "/zendoro"
  },
  {
    id: "seller",
    title: "Seller Operations",
    type: "seller",
    status: "founder-preview",
    description: "Store management and merchant workflow visibility.",
    href: "/zendoro"
  },
  {
    id: "trust",
    title: "Trust Layer",
    type: "trust",
    status: "safe-active",
    description: "Trust, moderation, verification and reputation surfaces.",
    href: "/zendoro"
  },
  {
    id: "commerce",
    title: "Commerce Engine",
    type: "commerce",
    status: "founder-preview",
    description: "Order, checkout and marketplace flow visibility.",
    href: "/wallet"
  }
];

export function getZendoroActivationSummary() {
  return {
    status: "ZENDORO_ACTIVATED_FOR_FOUNDER_REVIEW",
    surfaceCount: zendoroActivationSurfaces.length,
    checkoutLive: false,
    payoutsLive: false,
    testerInvitesBlocked: true,
    safeMode: true
  };
}
