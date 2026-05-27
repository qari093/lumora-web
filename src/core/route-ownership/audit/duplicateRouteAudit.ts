export function duplicateRouteAudit(routes: string[]) {
  const seen = new Set<string>();
  const duplicates = routes.filter((route) => {
    if (seen.has(route)) return true;
    seen.add(route);
    return false;
  });

  return {
    duplicates,
    clean: duplicates.length === 0
  };
}
