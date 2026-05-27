export type WitnessProfileLinkPolicy = {
  profileLinksVisible: false;
  socialLinksVisible: false;
  directMessagingEnabled: false;
  reason: "witness_continuity_not_social_graph";
};

export function getWitnessProfileLinkPolicy(): WitnessProfileLinkPolicy {
  return {
    profileLinksVisible: false,
    socialLinksVisible: false,
    directMessagingEnabled: false,
    reason: "witness_continuity_not_social_graph",
  };
}
