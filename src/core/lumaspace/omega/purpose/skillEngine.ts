import type { SkillSignal } from "./types";

export function createSkillSignal(input: SkillSignal): SkillSignal {
  if (!input.id.trim()) throw new Error("skill_signal_id_required");
  if (!input.citizenId.trim()) throw new Error("citizenId_required");
  if (!input.skill.trim()) throw new Error("skill_required");
  if (!input.offering && !input.seeking) throw new Error("skill_must_offer_or_seek");

  return input;
}

export function findComplementarySkills(a: SkillSignal[], b: SkillSignal[]): string[] {
  const out = new Set<string>();

  for (const left of a) {
    for (const right of b) {
      if (
        left.skill === right.skill &&
        left.citizenId !== right.citizenId &&
        ((left.offering && right.seeking) || (left.seeking && right.offering))
      ) {
        out.add(left.skill);
      }
    }
  }

  return [...out];
}
