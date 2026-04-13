export function getLanguage(code?: string) {
  const map = { en:"English", de:"German", ur:"Urdu", hi:"Hindi" };
  return code ? map[code as keyof typeof map] || null : map;
}
