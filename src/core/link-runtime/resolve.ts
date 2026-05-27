export function resolveLumoraLink(id: string) {
  if (!id || id.length < 3) return null;

  return {
    id,
    resolved: true,
    ambientPortal: true,
  };
}
