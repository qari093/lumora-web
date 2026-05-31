export type LumaSpaceRole = "citizen" | "steward" | "guardian" | "council";

export type CivilizationPrinciple =
  | "belonging_over_attention"
  | "contribution_over_vanity"
  | "memory_over_noise"
  | "consent_over_extraction"
  | "trust_over_growth"
  | "legacy_over_scroll";

export type CivilizationConstitution = {
  id: "lumaspace_omega_constitution";
  version: "1.0.0";
  principles: CivilizationPrinciple[];
  rights: {
    citizenRights: string[];
    communityRights: string[];
  };
  governance: {
    roles: LumaSpaceRole[];
    promotionRule: string;
    moderationRule: string;
    transparencyRule: string;
  };
  successMetrics: {
    primary: string[];
    forbidden: string[];
  };
};

export const LUMASPACE_OMEGA_CONSTITUTION: CivilizationConstitution = {
  id: "lumaspace_omega_constitution",
  version: "1.0.0",
  principles: [
    "belonging_over_attention",
    "contribution_over_vanity",
    "memory_over_noise",
    "consent_over_extraction",
    "trust_over_growth",
    "legacy_over_scroll",
  ],
  rights: {
    citizenRights: [
      "own_identity",
      "control_visibility",
      "export_memories",
      "leave_without_penalty",
      "use_private_defaults",
    ],
    communityRights: [
      "define_culture",
      "set_guardians",
      "preserve_history",
      "moderate_transparently",
      "reject_extractive_growth",
    ],
  },
  governance: {
    roles: ["citizen", "steward", "guardian", "council"],
    promotionRule: "Promotion is earned through reliability, contribution, and trust.",
    moderationRule: "Moderation must protect dignity, consent, and community safety.",
    transparencyRule: "Major governance actions must produce reviewable records.",
  },
  successMetrics: {
    primary: [
      "meaningful_return_rate",
      "trusted_relationship_creation",
      "mission_completion",
      "memory_creation",
      "community_health",
    ],
    forbidden: [
      "rage_engagement",
      "infinite_scroll_dependency",
      "public_vanity_ranking",
      "coercive_streaks",
    ],
  },
};

export function validateCivilizationConstitution(input: CivilizationConstitution): boolean {
  return (
    input.id === "lumaspace_omega_constitution" &&
    input.principles.includes("belonging_over_attention") &&
    input.principles.includes("consent_over_extraction") &&
    input.governance.roles.includes("guardian") &&
    input.successMetrics.forbidden.includes("infinite_scroll_dependency")
  );
}
