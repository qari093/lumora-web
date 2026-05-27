export function enforceLiveModeration(input: { toxicity: number; spam: number; scam: number }) {
  const blocked = input.toxicity >= 0.85 || input.spam >= 0.9 || input.scam >= 0.8;
  return { blocked, reviewRequired: blocked || input.toxicity >= 0.65, enforcementLogged: true, creatorShield: true };
}
