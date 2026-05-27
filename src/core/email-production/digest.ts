export function buildWeeklyLuminescentDigest(input: {
  userId: string;
  items: string[];
}) {
  return {
    userId: input.userId,
    subject: "Weekly Luminescent Digest",
    items: input.items,
    generatedAt: new Date().toISOString(),
  };
}
