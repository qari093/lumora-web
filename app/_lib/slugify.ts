export function baseSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}
export function rnd(n = 6) {
  const a = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < n; i++) out += a[Math.floor(Math.random() * a.length)];
  return out;
}
