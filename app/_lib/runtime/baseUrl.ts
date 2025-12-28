export function getPublicBaseUrl(): string {
  // Prefer explicit public base URL (for LAN / device testing)
  const env = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "";
  if (env) return env.replace(/\/+$/, "");
  // Fallback (server-side): infer from Vercel URL if present
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  if (vercel) return vercel.replace(/\/+$/, "");
  // Last resort: localhost
  return "http://localhost:3000";
}
