export function eventDeduplication(id: string, seen: string[]) {
  return {
    duplicate: seen.includes(id)
  };
}
