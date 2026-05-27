import { validateWitnessName } from "../identity/witnessName";

export function selectWitnessName(name: string): { ok: boolean; value?: string } {
  if (!validateWitnessName(name)) return { ok: false };
  return { ok: true, value: name.trim() };
}
