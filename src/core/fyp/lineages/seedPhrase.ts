import type {
  SeedPhrase
} from "./types";

export function createSeedPhrase(input: {
  ownerUserId: string;
  words: [string, string, string];
}): SeedPhrase {
  if (!input.ownerUserId.trim()) {
    throw new Error("Seed phrase requires ownerUserId.");
  }

  const phrase = input.words.join(".");

  if (!/^[a-z0-9-]+\.[a-z0-9-]+\.[a-z0-9-]+$/.test(phrase)) {
    throw new Error("Invalid seed phrase format.");
  }

  return {
    ownerUserId: input.ownerUserId,
    phrase,
    active: true
  };
}
