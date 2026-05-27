export function runtimeConflictScanner(items: { route: string; owner: string }[]) {
  const conflicts = items.filter((item) => !item.owner);
  return {
    conflicts,
    safe: conflicts.length === 0
  };
}
