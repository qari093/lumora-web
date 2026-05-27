export function resolveLumoraLink(slug: string) {
  if (!slug || slug.length < 3) return null;

  return {
    slug,
    resolved: true,
    ambientPortal: true,
  };
}
