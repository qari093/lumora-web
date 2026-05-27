export function sessionRecovery(id: string) {
  return {
    restored: id.length > 0
  };
}
