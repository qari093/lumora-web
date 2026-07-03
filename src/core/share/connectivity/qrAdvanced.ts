import type { ConnectivityPayload } from "./types";

export function createAdvancedQrPayload(payload: ConnectivityPayload) {
  return {
    version: "usl-qr-v1",
    shareId: payload.shareId,
    url: payload.url,
    title: payload.title,
    format: "svg",
    errorCorrection: "M",
    quietZone: 4,
    downloadable: true,
  };
}

export function createQrExportFilename(payload: ConnectivityPayload): string {
  return `lumora-share-${payload.shareId}.svg`;
}

export function createQrDeepLinkPayload(payload: ConnectivityPayload) {
  return {
    qr: createAdvancedQrPayload(payload),
    fallbackUrl: payload.url,
    embeddedMetadata: {
      title: payload.title,
      channel: payload.channel,
    },
  };
}
