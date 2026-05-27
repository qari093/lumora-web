export function calculateCreatorSplit(amountCents: number) {
  return {
    creatorCents: Math.floor(amountCents * 0.9),
    platformCents: amountCents - Math.floor(amountCents * 0.9),
  };
}
