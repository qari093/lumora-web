export type DeepLinkPayload = {
  entityType?: "video" | "post" | "live" | "gmar" | "nexa";
  entityId?: string | null;
  slug?: string | null;
};

export type DeepLinkResult =
  | { ok: true; url: string }
  | { ok: false; reason: string };

export function buildExternalShareLink(
  input: DeepLinkPayload,
  baseUrl: string = "https://lumora.app"
): DeepLinkResult {
  const entityType = input.entityType;
  const entityId = typeof input.entityId === "string" ? input.entityId.trim() : "";
  const slug = typeof input.slug === "string" ? input.slug.trim() : "";

  if (!entityType) return { ok: false, reason: "missing_entity_type" };
  if (!entityId) return { ok: false, reason: "missing_entity_id" };

  const cleanBase = baseUrl.replace(/\/+$/, "");
  const safeSlug = slug ? `/${encodeURIComponent(slug)}` : "";

  return {
    ok: true,
    url: `${cleanBase}/share/${entityType}/${encodeURIComponent(entityId)}${safeSlug}`,
  };
}
