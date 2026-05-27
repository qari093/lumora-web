export function createWaitlistEntry(input: { email: string; source?: string }) {
  return {
    id: `waitlist-${input.email}`,
    ...input,
    status: "queued",
    createdAt: new Date().toISOString(),
  };
}
