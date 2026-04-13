export type CultureTaxonomyDomain =
  | "humor"
  | "religion"
  | "politics"
  | "national-identity"
  | "historical-memory"
  | "gender"
  | "violence"
  | "language-nuance"
  | "symbolism"
  | "fandom-behavior";

export type CultureTaxonomySeverity =
  | "low"
  | "medium"
  | "high"
  | "restricted";

export type CultureTaxonomyEntry = {
  id: string;
  domain: CultureTaxonomyDomain;
  label: string;
  description: string;
  severity: CultureTaxonomySeverity;
  requiresReview: boolean;
};

export const CULTURE_INTELLIGENCE_TAXONOMY: CultureTaxonomyEntry[] = [
  {
    id: "humor-satire",
    domain: "humor",
    label: "Humor / Satire",
    description: "Jokes, irony, parody, sarcasm, and satire that may shift meaning across regions.",
    severity: "medium",
    requiresReview: false,
  },
  {
    id: "religious-signals",
    domain: "religion",
    label: "Religious Signals",
    description: "Content involving sacred symbols, rituals, or sensitive religious framing.",
    severity: "high",
    requiresReview: true,
  },
  {
    id: "political-framing",
    domain: "politics",
    label: "Political Framing",
    description: "Political references, narratives, movements, or symbolism with social sensitivity.",
    severity: "high",
    requiresReview: true,
  },
  {
    id: "national-identity",
    domain: "national-identity",
    label: "National Identity",
    description: "Flags, borders, sovereignty, patriotism, and regionally sensitive identity framing.",
    severity: "high",
    requiresReview: true,
  },
  {
    id: "historical-memory",
    domain: "historical-memory",
    label: "Historical Memory",
    description: "References to historical trauma, conflict, colonial memory, or contested events.",
    severity: "restricted",
    requiresReview: true,
  },
  {
    id: "gender-cues",
    domain: "gender",
    label: "Gender Cues",
    description: "Gendered framing, stereotypes, or role-sensitive portrayal requiring contextual care.",
    severity: "medium",
    requiresReview: false,
  },
  {
    id: "violence-intensity",
    domain: "violence",
    label: "Violence Intensity",
    description: "Physical harm, threat intensity, graphic implication, or glamorized conflict.",
    severity: "high",
    requiresReview: true,
  },
  {
    id: "language-nuance",
    domain: "language-nuance",
    label: "Language Nuance",
    description: "Phrases whose emotional, ironic, or offensive meaning changes by language context.",
    severity: "medium",
    requiresReview: false,
  },
  {
    id: "symbolism-layer",
    domain: "symbolism",
    label: "Symbolism Layer",
    description: "Visual or textual symbols with culture-specific interpretation or controversy.",
    severity: "high",
    requiresReview: true,
  },
  {
    id: "fandom-behavior",
    domain: "fandom-behavior",
    label: "Fandom Behavior",
    description: "Tribal, rivalry, or pile-on dynamics that may need spread controls.",
    severity: "medium",
    requiresReview: false,
  },
];

export function getCultureTaxonomyEntry(
  id: string
): CultureTaxonomyEntry | undefined {
  return CULTURE_INTELLIGENCE_TAXONOMY.find((entry) => entry.id === id);
}

export function getCultureTaxonomyByDomain(
  domain: CultureTaxonomyDomain
): CultureTaxonomyEntry[] {
  return CULTURE_INTELLIGENCE_TAXONOMY.filter((entry) => entry.domain === domain);
}
