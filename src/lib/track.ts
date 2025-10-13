// src/lib/track.ts
"use client";

/**
 * Lightweight analytics helper for Lumora.
 * Sends events to /api/analytics/track using sendBeacon (when possible),
 * falling back to fetch for dev.
 */

type Props = Record<string, unknown>;

const ENDPOINT = "/api/analytics/track";

export function track(type: string, props: Props = {}): void {
  const payload = JSON.stringify({ type, props, ts: Date.now() });

  // Prefer sendBeacon to avoid blocking UI / page unloads.
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(ENDPOINT, blob);
      return;
    } catch {
      // fall through to fetch
    }
  }

  // Fallback (dev): fire-and-forget fetch
  try {
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      cache: "no-store",
    }).catch(() => {});
  } catch {
    // ignore
  }
}

export function pageView(path: string) {
  track("page_view", { path });
}

export function videoImpression(videoId: string | undefined, meta: Props = {}) {
  track("video_impression", { videoId, ...meta });
}

export function videoAction(
  videoId: string | undefined,
  action: "play" | "pause" | "ended" | "like" | "skip" | "replay" | "share",
  meta: Props = {}
) {
  track("video_action", { videoId, action, ...meta });
}
