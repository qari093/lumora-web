import type { OneTimeMirror, OneTimeMirrorInput } from "./types";

export function buildOneTimeMirror(input: OneTimeMirrorInput): OneTimeMirror {
  const eligible = input.monthsCompleted >= 12 && input.acceptedSymbols.length >= 6;

  if (!eligible) {
    return {
      eligible: false,
      creatorId: input.creatorId,
      symbols: input.acceptedSymbols.slice(0, 12),
      line: "Your year is still gathering its quiet shape."
    };
  }

  const minutes = Math.max(0, Math.floor(input.totalLingerMinutes));
  const returns = Math.max(0, Math.floor(input.quietReturns));

  return {
    eligible: true,
    creatorId: input.creatorId,
    symbols: input.acceptedSymbols.slice(0, 12),
    line: `Over one year, your work gathered ${returns} quiet returns and ${minutes} minutes of human presence.`
  };
}

export function buildAnnualSymbolConstellation(symbols: readonly string[]): string[] {
  return symbols.filter(Boolean).slice(0, 12);
}
