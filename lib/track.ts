// lib/track.ts / src/lib/track.ts
// Lightweight client-side tracking helpers for FYP video events.
// Supports both object-style and shorthand calls used in EmotionalCard.

export type VideoActionKind =
  | "view"
  | "start"
  | "play"
  | "pause"
  | "ended"
  | "complete"
  | "like"
  | "dislike"
  | "share"
  | "comment"
  | "favorite"
  | "skip"
  | "hover"
  | "mute"
  | "unmute"
  | "fullscreen"
  | "exit_fullscreen"
  | "scroll_pass"
  | "impression"
  | "replay"
  | (string & {}); // allow future custom actions

export type BaseVideoTrackingPayload = {
  videoId: string;
  sessionId?: string;
  userId?: string;
  position?: number; // seconds into the video
  meta?: Record<string, unknown>;
};

export type VideoActionPayload = BaseVideoTrackingPayload & {
  action: VideoActionKind;
};

export type VideoImpressionPayload = BaseVideoTrackingPayload & {
  // action is implicitly "impression"
};

const TRACK_ENDPOINT = "/api/track/video";

function sendTracking(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    ts: Date.now(),
    ...payload,
  });

  try {
    if (typeof navigator !== "undefined" && typeof (navigator as any).sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      (navigator as any).sendBeacon(TRACK_ENDPOINT, blob);
      return;
    }

    void fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // swallow all errors to avoid breaking UX
  }
}

// Overload 1: object-style
export function videoAction(payload: VideoActionPayload): void;
// Overload 2: shorthand used by EmotionalCard: videoAction(videoId, "play" | "pause" | ...)
export function videoAction(
  videoId: string,
  action: VideoActionKind,
  metaOrPosition?: number | Record<string, unknown>
): void;

export function videoAction(
  arg1: string | VideoActionPayload,
  arg2?: VideoActionKind,
  arg3?: number | Record<string, unknown>
): void {
  let payload: VideoActionPayload;

  if (typeof arg1 === "string") {
    const videoId = arg1;
    const action: VideoActionKind = arg2 ?? "view";
    let position: number | undefined;
    let meta: Record<string, unknown> | undefined;

    if (typeof arg3 === "number") {
      position = arg3;
    } else if (arg3 && typeof arg3 === "object") {
      meta = arg3 as Record<string, unknown>;
    }

    payload = { videoId, action, position, meta };
  } else {
    payload = arg1;
  }

  if (!payload.videoId || !payload.action) return;

  sendTracking({
    type: "video_action",
    ...payload,
  });
}

// Overload 1: object-style
export function videoImpression(payload: VideoImpressionPayload): void;
// Overload 2: shorthand used by EmotionalCard: videoImpression(videoId, { src: ... })
export function videoImpression(
  videoId: string,
  meta?: Record<string, unknown>
): void;

export function videoImpression(
  arg1: string | VideoImpressionPayload,
  arg2?: Record<string, unknown>
): void {
  let payload: VideoImpressionPayload;

  if (typeof arg1 === "string") {
    payload = {
      videoId: arg1,
      meta: arg2,
    };
  } else {
    payload = arg1;
  }

  if (!payload.videoId) return;

  const merged: VideoActionPayload = {
    ...payload,
    action: "impression",
  };

  videoAction(merged);
}
