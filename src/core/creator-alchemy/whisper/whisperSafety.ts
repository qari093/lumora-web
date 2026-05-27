import { validateCreatorAlchemyCopy } from "../foundation";

const FORBIDDEN = [
  "you are depressed",
  "your audience needs you",
  "you must post",
  "you are broken",
  "diagnosis",
  "trauma",
  "guaranteed payout"
];

export function isWhisperCopySafe(text: string): boolean {
  const lower = text.toLowerCase();
  if (FORBIDDEN.some((phrase) => lower.includes(phrase))) return false;
  return validateCreatorAlchemyCopy(text).ok;
}

export function softenWhisper(text: string): string {
  return text
    .replaceAll("must", "may")
    .replaceAll("always", "often")
    .replaceAll("never", "rarely")
    .trim();
}
