export function portalEvent(domain: string, action: string) {
  return {
    domain,
    action,
    accepted: Boolean(domain && action)
  };
}
