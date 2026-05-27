export function canTransition(from: string, to: string): boolean {
  const map: Record<string, string[]> = {
    "at-rest": ["awaiting-circle"],
    "awaiting-circle": ["being-witnessed"],
    "being-witnessed": ["after-witness"],
    "after-witness": ["echo-active"],
    "echo-active": ["at-rest"]
  };
  return map[from]?.includes(to) || false;
}
