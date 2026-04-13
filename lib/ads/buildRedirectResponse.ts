import { resolveAdRoute } from "@/lib/ads/resolveAdRoute";

export function buildRedirectPayload(input: { type: string; value: string }) {
  const resolved = resolveAdRoute(input);

  if (!resolved.valid) {
    return {
      ok: false as const,
      error: "invalid_redirect_target",
      resolved,
    };
  }

  return {
    ok: true as const,
    resolved,
    redirectTo: resolved.destination,
  };
}
