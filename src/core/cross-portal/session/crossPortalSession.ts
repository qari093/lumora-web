export function crossPortalSession(from: string, to: string) {
  return {
    from,
    to,
    preserved: true
  };
}
