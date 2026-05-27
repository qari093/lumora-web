export function identityBridge(from: string, to: string) {
  return {
    from,
    to,
    identityPreserved: true
  };
}
