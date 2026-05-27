export type CreatorSystemRole =
  | "creator"
  | "witness"
  | "host"
  | "keeper";

export type CreatorSystemTerm =
  | "Creator"
  | "Witness"
  | "Witness Name"
  | "Circle"
  | "Anchor Circle"
  | "Phantom Circle"
  | "Human Signal"
  | "Silent Ovation"
  | "Witness Thread"
  | "Memory Shelf"
  | "Echo"
  | "Micro-Value Window";

export const CREATOR_SYSTEM_TERMINOLOGY: Record<CreatorSystemTerm, string> = {
  Creator: "A person sharing work to be witnessed, not ranked.",
  Witness: "A person present with creator work through human signals.",
  "Witness Name": "A soft identity label used for continuity without social-profile pressure.",
  Circle: "A timed shared room where creator work is watched with minimal signals.",
  "Anchor Circle": "The daily primary circle around which creator witnessing gathers.",
  "Phantom Circle": "A safe newcomer preview circle before public participation.",
  "Human Signal": "A direct intentional action from a human witness.",
  "Silent Ovation": "A quiet appreciation signal without comments or public score pressure.",
  "Witness Thread": "A non-numeric continuity line showing repeated human presence.",
  "Memory Shelf": "A private drawer of witnessed moments over time.",
  Echo: "A 24-hour afterglow layer from a circle.",
  "Micro-Value Window": "A monetization-ready but non-coercive trust threshold.",
};

export function explainCreatorSystemTerm(term: CreatorSystemTerm): string {
  return CREATOR_SYSTEM_TERMINOLOGY[term];
}
