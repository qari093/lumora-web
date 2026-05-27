import type { PatronageRuntime } from "./types";

export function validatePatronageRuntime(input: PatronageRuntime): boolean {
  const copy = input.copy.toLowerCase();
  if (!input.approved) return false;
  if (copy.includes("buy reach") || copy.includes("jackpot") || copy.includes("guaranteed")) return false;
  return input.sponsorName.length > 0 && input.constellation.length > 0;
}
