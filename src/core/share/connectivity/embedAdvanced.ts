import type { ConnectivityPayload } from "./types";

export function createSafeEmbedHtml(payload: ConnectivityPayload): string {
  const title = payload.title.replace(/"/g, "&quot;");
  return `<iframe src="${payload.url}" title="${title}" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin" style="border:0;width:100%;max-width:420px;height:640px;border-radius:24px;"></iframe>`;
}

export function createEmbedScript(payload: ConnectivityPayload): string {
  return `<script async src="${payload.url.replace(/\/share\/.*/, "")}/embed/share.js" data-share-id="${payload.shareId}"></script>`;
}

export function createPortableEmbedManifest(payload: ConnectivityPayload) {
  return {
    version: "usl-portable-embed-v1",
    shareId: payload.shareId,
    html: createSafeEmbedHtml(payload),
    script: createEmbedScript(payload),
    permissions: ["view", "open_original"],
    revocationAware: true,
  };
}
