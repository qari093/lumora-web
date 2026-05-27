import type { CreatorAlchemyRuleId } from "./types";

export interface CreatorAlchemyRule {
  id: CreatorAlchemyRuleId;
  title: string;
  enforcement: "hard" | "soft";
  description: string;
}

export const CREATOR_ALCHEMY_RULES: readonly CreatorAlchemyRule[] = [
  {
    id: "emotional_truth",
    title: "Emotional Truth > Fake AI Poetry",
    enforcement: "hard",
    description: "Every emotional insight must be grounded in real behavior, not hollow inspirational text."
  },
  {
    id: "scarcity",
    title: "Scarcity Protects Sacredness",
    enforcement: "hard",
    description: "Rare emotional moments must remain rare to preserve meaning."
  },
  {
    id: "usability_first",
    title: "Atmosphere Never Damages Usability",
    enforcement: "hard",
    description: "Beauty supports clarity; navigation always wins."
  },
  {
    id: "fluid_identity",
    title: "Creator Identity Stays Fluid",
    enforcement: "hard",
    description: "Constellations are homes, not prisons."
  },
  {
    id: "human_economy",
    title: "ZenEconomy Stays Human",
    enforcement: "hard",
    description: "No gambling, speculation, or pay-to-win visibility."
  },
  {
    id: "non_invasive",
    title: "Emotional Systems Stay Gentle",
    enforcement: "hard",
    description: "Lumora notices patterns quietly and avoids surveillance-like behavior."
  },
  {
    id: "emotional_density",
    title: "Emotional Density Rule",
    enforcement: "hard",
    description: "Expose only one major insight, one atmosphere, and one symbolic moment by default."
  },
  {
    id: "creator_agency",
    title: "Creator Agency Always Exists",
    enforcement: "hard",
    description: "Creators can adjust, reject, opt out, rest, or lower intensity."
  }
] as const;

export function getCreatorAlchemyRule(id: CreatorAlchemyRuleId): CreatorAlchemyRule {
  const rule = CREATOR_ALCHEMY_RULES.find((item) => item.id === id);
  if (!rule) {
    throw new Error(`Unknown Creator Alchemy rule: ${id}`);
  }
  return rule;
}

export function validateRuleCoverage(): boolean {
  const ids = new Set(CREATOR_ALCHEMY_RULES.map((rule) => rule.id));
  return ids.size === 8 && CREATOR_ALCHEMY_RULES.every((rule) => rule.enforcement === "hard");
}
