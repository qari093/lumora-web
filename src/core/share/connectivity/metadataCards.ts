import type { ConnectivityPayload } from "./types";

export function createOpenGraphMetadata(payload: ConnectivityPayload) {
  return {
    "og:title": payload.title,
    "og:description": payload.text,
    "og:url": payload.url,
    "og:type": "article",
    "og:site_name": "Lumora",
  };
}

export function createTwitterCardMetadata(payload: ConnectivityPayload) {
  return {
    "twitter:card": "summary_large_image",
    "twitter:title": payload.title,
    "twitter:description": payload.text,
    "twitter:url": payload.url,
  };
}

export function createExternalPreviewCard(payload: ConnectivityPayload) {
  return {
    title: payload.title,
    description: payload.text,
    url: payload.url,
    provider: "Lumora",
    safeMetadata: true,
  };
}
