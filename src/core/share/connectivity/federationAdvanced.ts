import type { ConnectivityPayload } from "./types";

export function createFederatedShareDocument(payload: ConnectivityPayload, origin: string) {
  return {
    "@context": "https://lumora.app/ns/usl",
    type: "LumoraShare",
    id: `${origin.replace(/\/+$/, "")}/share/${encodeURIComponent(payload.shareId)}`,
    attributedTo: payload.metadata.creatorId ?? "unknown",
    name: payload.title,
    summary: payload.text,
    url: payload.url,
    portable: true,
  };
}

export function createFederationDiscoveryDocument(domain: string) {
  return {
    subject: `acct:share@${domain}`,
    links: [
      {
        rel: "self",
        type: "application/activity+json",
        href: `https://${domain}/.well-known/lumora-usl`,
      },
      {
        rel: "lumora-usl-share",
        href: `https://${domain}/api/share/federation`,
      },
    ],
  };
}

export function validateFederatedShareDocument(doc: ReturnType<typeof createFederatedShareDocument>): boolean {
  return doc.type === "LumoraShare" && doc.portable === true && doc.id.includes("/share/");
}
